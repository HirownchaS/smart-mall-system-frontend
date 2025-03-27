// import React from 'react';
// import { render, screen, fireEvent } from "@testing-library/react";
// import Parking from "../pages/Parking";
// import '@testing-library/jest-dom';
// import { decodeJwt } from "jose";

// // Mock static image imports
// jest.mock("../assets/car.png", () => "car.png");
// jest.mock("../assets/carslot.png", () => "carslot.png");

// // Mock decodeJwt to avoid real token dependency
// jest.mock("jose", () => ({
//   decodeJwt: jest.fn(() => ({
//     username: "TestUser",
//     _id: "12345",
//   })),
// }));

// describe("Parking Component", () => {
//   test("renders parking component correctly", () => {
//     render(<Parking />);
    
//     expect(screen.getByText(/Smart Parking Service/i)).toBeInTheDocument();
//     expect(screen.getByText(/Park your car without any hassle/i)).toBeInTheDocument();
//     expect(screen.getByPlaceholderText(/Car Number/i)).toBeInTheDocument();
//     expect(screen.getByRole("button", { name: /Book Slot/i })).toBeInTheDocument();
//   });

//   test("allows selecting a parking slot", () => {
//     render(<Parking />);

//     // Find a slot that is available (green)
//     const availableSlot = screen.getByText('S1');

//     // Click on the slot
//     fireEvent.click(availableSlot);

//     // Check if the slot was selected
//     expect(screen.getByPlaceholderText(/Slot ID/)).toHaveValue("S1");
//   });

//   test("prevents booking without required inputs", () => {
//     render(<Parking />);
    
//     fireEvent.click(screen.getByRole("button", { name: /Book Slot/ }));

//     expect(screen.getByText(/Please select a slot, enter your car number, and set both arrival and departure times/i)).toBeInTheDocument();
//   });

//   test("allows entering a car number", () => {
//     render(<Parking />);
    
//     const carNumberInput = screen.getByPlaceholderText(/Car Number/i);
//     fireEvent.change(carNumberInput, { target: { value: "ABC-1234" } });

//     expect(carNumberInput).toHaveValue("ABC-1234");
//   });

  
// });
