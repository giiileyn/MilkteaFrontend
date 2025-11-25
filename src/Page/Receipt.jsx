import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import receiptLogo from "../assets/milkymoodreceipt.png"; // <-- ADD THIS

export default function Receipt({ order }) {
  const receiptRef = useRef(null);

  const downloadPDF = async () => {
    const element = receiptRef.current;

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`receipt-${order.id}.pdf`);
  };

  return (
    <div
      style={{
        width: "350px",
        margin: "0 auto",
        textAlign: "center",
        padding: "10px",
      }}
    >
      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadPDF}
        style={{
          background: "#B39172",
          border: "none",
          padding: "10px 15px",
          borderRadius: "6px",
          color: "white",
          cursor: "pointer",
          marginBottom: "15px",
        }}
      >
        Download Receipt (PDF)
      </button>

      {/* ==== RECEIPT CONTENT ==== */}
      <div
        ref={receiptRef}
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          padding: "20px",
          color: "#333",
          lineHeight: 1.4,
          background: "white",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#B39172" }}>
            Milky Mood
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#8C7B6A" }}>
            Thank you for your order!
          </p>
        </div>

        {/* Order Info */}
        <div style={{ marginBottom: "15px" }}>
          <strong>Receipt:</strong> ORD-{String(order.id).padStart(3, "0")} <br />
          <strong>Date:</strong> {order.date} <br />
          <strong>Status:</strong> {order.status}
        </div>

        <hr style={{ border: "1px dashed #C9B8A6", margin: "10px 0" }} />

        {/* Items */}
        <div>
          {order.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "6px 0",
              }}
            >
              <span>
                {item.qty}x {item.name}
              </span>
              <span>₱ {item.price.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <hr style={{ border: "1px dashed #C9B8A6", margin: "10px 0" }} />

        {/* Total */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: "20px",
          }}
        >
          <span>Total:</span>
          <span>₱ {order.total.toLocaleString()}</span>
        </div>

        {/* Footer Text */}
        <div style={{ textAlign: "center", fontSize: "12px", color: "#8C7B6A" }}>
          <p>Visit us again at WowMilkteh!</p>
          <p>Enjoy your drink!</p>
        </div>

        {/* === IMAGE AT THE BOTTOM === */}
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <img
            src={receiptLogo}
            alt="Milky Mood Receipt Logo"
            style={{ width: "120px", opacity: 0.9 }}
          />
        </div>
      </div>
    </div>
  );
}
