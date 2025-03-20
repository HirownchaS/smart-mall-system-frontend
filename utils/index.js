export const convertToIST = (utcDate) => {
    const utcDateNew = new Date(utcDate);
    const istDate = utcDateNew.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      timeZoneName: "short",
    });
    console.log("IST Date : ", istDate);
  
    return istDate;
  };
  