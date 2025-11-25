import React, { useState, useEffect } from "react";
import axios from "axios";
import Receipt from "./Receipt"; // import your Receipt component

export default function Order() {
  const [tab, setTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [editingOrderId, setEditingOrderId] = useState(null);

const handleEdit = (orderId) => {
  setEditingOrderId(orderId); // show status buttons for this order
};

const handleStatusUpdate = async (order, newStatus) => {
  try {
    await axios.patch(`http://localhost:4000/orders/${order._id}/status`, {
      status: newStatus,
    });

    // Update local state immediately
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === order.id ? { ...o, status: newStatus } : o
      )
    );

    setEditingOrderId(null); // hide status buttons
  } catch (err) {
    console.error("Failed to update order status:", err);
    alert("Failed to update order status.");
  }
};



  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:4000/orders");
        const data = res.data.map((o, index) => ({
          _id: o._id, // keep backend ID for updates
          id: index + 1, // for display only
          date: new Date(o.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          status: o.status,
          total: o.totalPrice,
          items: o.products.map((p) => ({
            name: p.name,
            qty: p.quantity,
            price: p.price,
          })),
        }));

        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    tab === "All" ? orders : orders.filter((o) => o.status.toLowerCase() === tab.toLowerCase());

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading orders...</div>;
  }

  return (
    <>
      <style>{`
        body { margin: 0; background: #F3E9DA !important; }
        .order-page-container { padding: 20px; background: #F3E9DA; min-height: 100vh; width: 100vw; overflow-x: hidden; position: relative; }
        .order-tabs { display: flex; gap: 12px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 10px; width: 100%; }
        .order-tab { padding: 10px 24px; border-radius: 25px; border: 1px solid #C9B8A6; background: #E6D6C4; cursor: pointer; font-size: 15px; font-weight: 500; color: #5A4632; white-space: nowrap; transition: 0.2s; }
        .order-tab.active { background: #B39172; color: white; border-color: #A07C5A; }
        .order-card { background: #FFF5E1; padding: 20px; border-radius: 18px; margin-bottom: 20px; width: calc(100% - 90px); margin-left: 20px; box-shadow: 0 3px 8px #00000015; border: 1px solid #E2D4C4; }
        .order-header { display: flex; justify-content: space-between; align-items: center; padding-right: 20px; }
        .order-header h3 { margin: 0; color: #5A4632; }
        .order-date { color: #8C7B6A; font-size: 14px; }
        .status-badge { padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 600; text-transform: capitalize; margin-right: 10px; }
        .status-badge.completed { background: #DDEDD8; color: #4B7C47; }
        .status-badge.pending { background: #FCE7B6; color: #B27A1A; }
        .status-badge.cancelled { background: #F7D6D6; color: #B23A3A; }

        .edit-icon {
          cursor: pointer;
          font-size: 17px;
          margin-left: 5px;
          color: #7A614A;
          user-select: none;
          transition: 0.2s;
        }
        .edit-icon:hover {
          color: #4a3729;
          transform: scale(1.15);
        }

        .order-items { margin: 15px 0; }
        .order-item { display: flex; align-items: center; justify-content: space-between; padding: 5px 10px; }
        .order-item span { color: #5A4632; font-size: 15px; }
        .dot { width: 10px; height: 10px; background: #7F9D63; border-radius: 50%; margin-right: 10px; }
        .price { color: #8C7B6A; margin-right: 15px; }
        .order-footer { display: flex; justify-content: space-between; align-items: center; padding: 0 10px; }
        .order-footer small { font-size: 13px; color: #8C7B6A; }
        .order-footer h3 { margin: 3px 0; color: #5A4632; }
        .btn.details, .btn.receipt { background: #CFC4B6; color: #5A4632; padding: 8px 16px; border-radius: 14px; border: none; cursor: pointer; font-size: 14px; font-weight: 600; margin-right: 10px; }
        .btn.details:hover, .btn.receipt:hover { background: #B5A797; }
        .receipt-panel { position: fixed; top: 0; right: 0; width: 400px; max-width: 90%; height: 100vh; background: white; box-shadow: -3px 0 15px #00000020; padding: 20px; overflow-y: auto; transform: translateX(100%); transition: transform 0.3s ease-in-out; z-index: 999; }
        .receipt-panel.open { transform: translateX(0); }
        .receipt-close { position: absolute; top: 15px; right: 15px; cursor: pointer; font-weight: bold; font-size: 18px; }
      `}</style>

      <div className="order-page-container">
        {/* FILTER TABS */}
        <div className="order-tabs">
          {["All", "Pending", "Completed", "Cancelled"].map((t) => (
            <button
              key={t}
              className={`order-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ORDER CARDS */}
        {filteredOrders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          filteredOrders.map((order, index) => (
            <div key={index} className="order-card">
              <div className="order-header">
                <div>
                  <h3>ORD-{String(order.id).padStart(3, "0")}</h3>
                  <span className="order-date">{order.date}</span>
                </div>

                {/* STATUS + EDIT ICON (FOR PENDING ONLY) */}
                <div style={{ display: "flex", alignItems: "center" }}>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>

                {order.status.toLowerCase() === "pending" && (
                  <span className="edit-icon" onClick={() => handleEdit(order.id)}>
                    🖉
                  </span>
                )}

                {/* Show clickable buttons only for the order being edited */}
                {editingOrderId === order.id && (
                  <div style={{ marginLeft: "10px" }}>
                    <button
                      className="status-badge completed"
                      onClick={() => handleStatusUpdate(order, "Completed")}
                    >
                      Completed
                    </button>
                    <button
                      className="status-badge cancelled"
                      onClick={() => handleStatusUpdate(order, "Cancelled")}
                    >
                      Cancelled
                    </button>
                  </div>
                )}
              </div>

              </div>

              <div className="order-items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span className="dot"></span>
                      <span>
                        {item.qty}x {item.name}
                      </span>
                    </div>
                    <span className="price">₱ {item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div>
                  <small>Total Amount</small>
                  <h3>₱ {order.total.toLocaleString()}</h3>
                </div>

                <div>
                  <button className="btn details">Details</button>

                  {order.status.toLowerCase() === "completed" && (
                    <button
                      className="btn receipt"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Receipt
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RECEIPT SIDE PANEL */}
      <div className={`receipt-panel ${selectedOrder ? "open" : ""}`}>
        {selectedOrder && (
          <>
            <div className="receipt-close" onClick={() => setSelectedOrder(null)}>×</div>
            <Receipt order={selectedOrder} />
          </>
        )}
      </div>
    </>
  );
}