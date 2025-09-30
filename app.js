// Dữ liệu mẫu
const chuyenXe = [
  {
    id: 1,
    nhaXe: "Phương Trang",
    diemDi: "Sài Gòn",
    diemDen: "Đà Lạt",
    gioDi: "08:00",
    gioDen: "12:30",
    gia: 250000,
    hinh: "https://picsum.photos/400/200?1",
  },
  {
    id: 2,
    nhaXe: "Thành Bưởi",
    diemDi: "Hà Nội",
    diemDen: "Sapa",
    gioDi: "07:00",
    gioDen: "15:00",
    gia: 450000,
    hinh: "https://picsum.photos/400/200?2",
  },
];

window.addEventListener("DOMContentLoaded", () => {
  const featured = document.getElementById("featured-routes");
  if (featured) {
    featured.innerHTML = chuyenXe
      .map(
        (c) => `
        <div class="col-md-4">
          <div class="card shadow-sm h-100">
            <img src="${c.hinh}" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">${c.diemDi} → ${c.diemDen}</h5>
              <p class="card-text">🚌 ${c.nhaXe} <br> 🕗 ${c.gioDi} - ${
          c.gioDen
        } <br> 💰 ${c.gia.toLocaleString()}đ</p>
              <a href="ChiTiet.html?id=${
                c.id
              }" class="btn btn-primary w-100">Đặt vé</a>
            </div>
          </div>
        </div>
      `
      )
      .join("");
  }

  // Trang chi tiết: render sơ đồ ghế + tính tiền
  const seatMapEl = document.getElementById("seat-map");
  if (seatMapEl) {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    const trip = chuyenXe.find((c) => c.id === id) || chuyenXe[0];

    const tripDetail = document.getElementById("trip-detail");
    if (tripDetail) {
      tripDetail.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <h5 class="mb-1">${trip.diemDi} → ${trip.diemDen}</h5>
                <div class="text-muted">🚌 ${trip.nhaXe} &nbsp; | &nbsp; 🕗 ${
        trip.gioDi
      } - ${trip.gioDen}</div>
              </div>
              <div class="text-primary fw-bold">Giá/ghế: ${trip.gia.toLocaleString()}đ</div>
            </div>
          </div>
        </div>`;
    }

    // giả lập danh sách ghế đã đặt (layout 2-aisle-2)
    const bookedSeats = new Set(["1B", "3C", "6D"]);

    // layout: 8 hàng (1-8), 2 ghế - lối đi - 2 ghế
    const rows = [1, 2, 3, 4, 5, 6, 7, 8];
    const leftCols = ["A", "B"]; // A: cửa sổ trái, B: gần lối đi
    const rightCols = ["C", "D"]; // C: gần lối đi, D: cửa sổ phải
    const selected = new Set();

    function seatSideClass(col) {
      if (col === "A" || col === "D") return " window";
      if (col === "B" || col === "C") return " aisle-side";
      return "";
    }

    seatMapEl.innerHTML = rows
      .map((r) => {
        const left = leftCols
          .map((col) => {
            const code = `${r}${col}`;
            const state = bookedSeats.has(code) ? " booked" : "";
            const extra = seatSideClass(col);
            return `<div class="seat${state}${extra}" data-seat="${code}" title="Ghế ${code}">${code}</div>`;
          })
          .join("");
        const right = rightCols
          .map((col) => {
            const code = `${r}${col}`;
            const state = bookedSeats.has(code) ? " booked" : "";
            const extra = seatSideClass(col);
            return `<div class="seat${state}${extra}" data-seat="${code}" title="Ghế ${code}">${code}</div>`;
          })
          .join("");
        return `<div class="seat-row"><div class="seat-group">${left}</div><div class="aisle"></div><div class="seat-group">${right}</div></div>`;
      })
      .join("");

    // cập nhật tóm tắt
    const selectedSeatsEl = document.getElementById("selected-seats");
    const totalPriceEl = document.getElementById("total-price");
    const seatsInput = document.getElementById("seats-input");

    function renderSummary() {
      const arr = Array.from(selected).sort();
      selectedSeatsEl.textContent = arr.length ? arr.join(", ") : "Không có";
      totalPriceEl.textContent = `${(arr.length * trip.gia).toLocaleString()}đ`;
      if (seatsInput) seatsInput.value = arr.join(",");
    }

    renderSummary();

    // click chọn ghế
    seatMapEl.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.classList.contains("seat")) return;
      if (target.classList.contains("booked")) return;

      const code = target.getAttribute("data-seat");
      if (!code) return;

      if (selected.has(code)) {
        selected.delete(code);
        target.classList.remove("selected");
      } else {
        selected.add(code);
        target.classList.add("selected");
      }
      renderSummary();
    });

    // yêu cầu chọn ít nhất 1 ghế trước khi đặt
    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
      bookingForm.addEventListener("submit", (e) => {
        if (selected.size === 0) {
          e.preventDefault();
          alert("Vui lòng chọn ít nhất một ghế.");
        }
      });
    }
  }
});
