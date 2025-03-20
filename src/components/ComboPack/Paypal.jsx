import React, { useRef, useEffect } from "react";
import jsPDF from "jspdf";
import { decodeJwt } from "jose";
import axios from "axios";
import Swal from "sweetalert2";


export default function Paypal({
  description,
  price,
  comboPackDetails,
  onPaymentComplete,
}) {
  const paypal = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: description,
                amount: {
                  currency_code: "CAD",
                  value: price.toString(),
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const token = localStorage.getItem("authtoken");

          const decodedToken = decodeJwt(token); // Decode the JWT payload to get the user ID
          const userId = decodedToken._id;
          const order = await actions.order.capture();
          console.log(order);
          generatePDF(comboPackDetails);
          const reply = {
            subject: `Combo Pack Purchased - ${comboPackDetails.comboPackName}`,
            html: `
              <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4CAF50; font-size: 24px;">Combo Pack Purchased</h2>
                <p style="font-size: 16px; line-height: 1.5;">
                  Dear Customer,
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                  Congratulations! You have successfully purchased the <strong>${comboPackDetails.comboPackName}</strong> combo pack.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                  The total amount charged is <strong>$${price}</strong>.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                  We hope you enjoy the benefits of your new combo pack! If you have any questions, feel free to reach out to our support team.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">
                  Thank you for your purchase!
                </p>
                <p style="font-style: italic; font-size: 14px; color: #888; margin-top: 20px;">
                  Best regards,<br/>
                  The Team at Mall360
                </p>
              </div>
            `,
          };
          

          await axios
            .post(`http://localhost:8080/api/mail/${userId}`, reply)
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: res.data.message,
                text: "User notified!!", // Display the error message from the controller
                showConfirmButton: true,
              });
            })
            .catch((err) => {
              console.log(err);
            });
          onPaymentComplete();
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, [description, price, comboPackDetails, onPaymentComplete]);

  const generatePDF = (details) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [100, 200],
    });

    // Background color
    doc.setFillColor(30, 144, 255); // dodger blue color
    doc.rect(0, 0, 200, 100, "F");

    // White rectangle for content
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(5, 5, 190, 90, 3, 3, "F");

    // Logo (placeholder)
    doc.setFillColor(30, 144, 255);
    doc.circle(15, 15, 5, "F");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text("Combo Pack >>>", 25, 20);

    // Event details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Claim your pack", 25, 30);
    doc.text(new Date().toLocaleString(), 25, 40);

    // Ticket info
    doc.setFillColor(173, 216, 230); // Light blue
    doc.roundedRect(25, 50, 150, 40, 2, 2, "F");
    doc.setTextColor(0, 0, 0);

    // Add detailed content with bold labels and smaller font
    doc.setFontSize(9); // Decreased overall font size

    // Price (bold label)
    doc.setFont("helvetica", "bold");
    doc.text("Price:", 30, 58);
    doc.setFont("helvetica", "normal");
    doc.text(`$${details.price}`, 45, 58);

    // Date (bold label)
    doc.setFont("helvetica", "bold");
    doc.text("Date:", 30, 64);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleString(), 45, 64);

    if (details.stores) {
      // Stores (bold label)
      doc.setFont("helvetica", "bold");
      doc.text("Stores:", 30, 70);
      doc.setFont("helvetica", "normal");
      details.stores.forEach((store, index) => {
        doc.text(
          `+ ${store.store.name} - Level: ${store.level}, Price: $${store.pricePerStore}`,
          35,
          76 + index * 5 // Slightly reduced vertical spacing
        );
      });
    }

    // Ticket number
    doc.setFontSize(14);
    doc.text("#000394", 170, 95);

    doc.save("ComboPackTicket.pdf");
  };

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
}
