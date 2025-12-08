import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface InvoiceData {
  invoiceDetails: {
    id: number | null;
    totalAmount?: number;
    charges: {
      carRentCharge?: number;
      protectionFee?: number;
    };
    paymentInfoDetalis?: Array<{
      carServiceName?: string;
      carServicePrice?: number;
    }>;
  };
  customerDetails: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    idNumber?: string;
    location?: string;
  };
  orderDetails: {
    id: number;
    bookingNumber?: number;
    creationdate?: string;
    rentDays?: number;
    dateFrom?: string;
    dateTo?: string;
    pickupLocation?: string;
    dropOffLocation?: string;
    totalPrice?: number;
    webSiteAmount?: number;
  };
  vendorDetails: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    location?: string;
  };
  carDetails: {
    carName?: string;
    model?: string;
    transmission?: string;
    type?: string;
    doors?: string;
    liter?: string;
  };
}

export const generateInvoicePDF = async (
  data: InvoiceData,
  locale: "en" | "ar" = "en"
) => {
  const formatCurrency = (amount: number | undefined) =>
    amount != null ? `${amount.toLocaleString()} SAR` : "0.00 SAR";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString(
        locale === "ar" ? "ar-SA" : "en-US"
      );
    } catch {
      return "-";
    }
  };

  // Translation
  const t =
    locale === "ar"
      ? {
          invoice: "فاتورة",
          customerInfo: "معلومات العميل",
          rentalDetails: "تفاصيل الإيجار",
          vehicleInfo: "معلومات المركبة",
          description: "الوصف",
          days: "الأيام",
          rate: "السعر",
          amount: "المبلغ",
          carRental: "إيجار السيارة",
          protectionFee: "رسوم الحماية",
          additionalServices: "خدمات إضافية",
          totalAmount: "المبلغ الإجمالي",
          paidAmount: "المبلغ المدفوع",
          remainingAmount: "المبلغ المتبقي",
          pickupDate: "تاريخ الاستلام",
          returnDate: "تاريخ الإرجاع",
          pickupLocation: "موقع الاستلام",
          returnLocation: "موقع الإرجاع",
          duration: "المدة",
          transmission: "ناقل الحركة",
          doors: "الأبواب",
          engine: "المحرك",
          type: "النوع",
          thankYou: "شكراً لاختيارك خدماتنا!",
          support: "الدعم",
          visitUs: "زيارتنا",
          name: "الاسم",
          email: "البريد الإلكتروني",
          phone: "الهاتف",
          id: "رقم الهوية",
          status: "الحالة",
          model: "الموديل",
        }
      : {
          invoice: "INVOICE",
          customerInfo: "Customer Information",
          rentalDetails: "Rental Details",
          vehicleInfo: "Vehicle Information",
          description: "Description",
          days: "Days",
          rate: "Rate",
          amount: "Amount",
          carRental: "Car Rental",
          protectionFee: "Protection Fee",
          additionalServices: "Additional Services",
          totalAmount: "Total Amount",
          paidAmount: "Paid Amount",
          remainingAmount: "Remaining Amount",
          pickupDate: "Pickup Date",
          returnDate: "Return Date",
          pickupLocation: "Pickup Location",
          returnLocation: "Return Location",
          duration: "Duration",
          transmission: "Transmission",
          doors: "Doors",
          engine: "Engine",
          type: "Type",
          thankYou: "Thank you for choosing our service!",
          support: "Support",
          visitUs: "Visit us",
          name: "Name",
          email: "Email",
          phone: "Phone",
          id: "ID",
          status: "Status",
          model: "Model",
        };

  // Create container
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.width = "1024px";
  container.style.background = "#ffffff";
  container.style.padding = "20px";
  container.style.boxSizing = "border-box";
  container.style.fontFamily = "Cairo, 'Noto Sans Arabic', Arial, sans-serif";
  container.style.color = "#333333";
  container.dir = locale === "ar" ? "rtl" : "ltr";

  // Helper to set text direction
  const getAlign = (isRTL: boolean) => (isRTL ? "right" : "left");

  // HEADER
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "20px";
  header.style.paddingBottom = "15px";
  header.style.borderBottom = "3px solid #3478f6";

  const logo = document.createElement("div");
  logo.innerHTML = `
    <div style="font-size: 24px; font-weight: bold; color: #3478f6;">Get Car</div>
    <div style="font-size: 11px; color: #666;">Premium Car Rental</div>
  `;
  logo.style.textAlign = locale === "ar" ? "right" : "left";

  const invoiceTitle = document.createElement("div");
  invoiceTitle.innerHTML = `
    <div style="font-size: 20px; font-weight: bold; color: #3478f6;">${
      t.invoice
    }</div>
    <div style="font-size: 10px; color: #666;">
      #${data.orderDetails.bookingNumber || "-"} | ${formatDate(
    data.orderDetails.creationdate
  )}
    </div>
  `;
  invoiceTitle.style.textAlign = "center";

  header.appendChild(logo);
  header.appendChild(invoiceTitle);
  container.appendChild(header);

  // TWO COLUMN SECTION
  const twoCol = document.createElement("div");
  twoCol.style.display = "grid";
  twoCol.style.gridTemplateColumns = "1fr 1fr";
  twoCol.style.gap = "20px";
  twoCol.style.marginBottom = "20px";

  // CUSTOMER INFO
  const custBox = document.createElement("div");
  custBox.style.border = "1px solid #e0e0e0";
  custBox.style.padding = "12px";
  custBox.style.borderRadius = "6px";
  custBox.style.background = "#f9f9f9";
  custBox.innerHTML = `
    <div style="font-weight: bold; font-size: 12px; margin-bottom: 8px; color: #3478f6;">${
      t.customerInfo
    }</div>
    <div style="font-size: 10px; line-height: 1.6;">
      <div><strong>${t.name}:</strong> ${
    data.customerDetails.fullName || "-"
  }</div>
      <div><strong>${t.email}:</strong> ${
    data.customerDetails.email || "-"
  }</div>
      <div><strong>${t.phone}:</strong> ${
    data.customerDetails.phoneNumber || "-"
  }</div>
      <div><strong>${t.id}:</strong> ${
    data.customerDetails.idNumber || "-"
  }</div>
    </div>
  `;
  custBox.style.textAlign = locale === "ar" ? "right" : "left";

  // RENTAL INFO
  const rentalBox = document.createElement("div");
  rentalBox.style.border = "1px solid #e0e0e0";
  rentalBox.style.padding = "12px";
  rentalBox.style.borderRadius = "6px";
  rentalBox.style.background = "#f9f9f9";
  rentalBox.innerHTML = `
    <div style="font-weight: bold; font-size: 12px; margin-bottom: 8px; color: #3478f6;">${
      t.rentalDetails
    }</div>
    <div style="font-size: 10px; line-height: 1.6;">
      <div><strong>${t.pickupLocation}:</strong> ${
    data.orderDetails.pickupLocation || "-"
  }</div>
      <div><strong>${t.returnLocation}:</strong> ${
    data.orderDetails.dropOffLocation || "-"
  }</div>
      <div><strong>${t.duration}:</strong> ${data.orderDetails.rentDays || 0} ${
    t.days
  }</div>
    </div>
  `;
  rentalBox.style.textAlign = locale === "ar" ? "right" : "left";

  twoCol.appendChild(custBox);
  twoCol.appendChild(rentalBox);
  container.appendChild(twoCol);

  // DATES INFO
  const datesRow = document.createElement("div");
  datesRow.style.display = "grid";
  datesRow.style.gridTemplateColumns = "1fr 1fr";
  datesRow.style.gap = "20px";
  datesRow.style.marginBottom = "20px";

  const pickupDate = document.createElement("div");
  pickupDate.style.padding = "10px";
  pickupDate.style.background = "#22C55E";
  pickupDate.style.color = "#fff";
  pickupDate.style.borderRadius = "4px";
  pickupDate.style.textAlign = "center";
  pickupDate.style.fontSize = "10px";
  pickupDate.innerHTML = `
    <div style="font-weight: bold;">${t.pickupDate}</div>
    <div>${formatDate(data.orderDetails.dateFrom)}</div>
  `;

  const returnDate = document.createElement("div");
  returnDate.style.padding = "10px";
  returnDate.style.background = "#DC3545";
  returnDate.style.color = "#fff";
  returnDate.style.borderRadius = "4px";
  returnDate.style.textAlign = "center";
  returnDate.style.fontSize = "10px";
  returnDate.innerHTML = `
    <div style="font-weight: bold;">${t.returnDate}</div>
    <div>${formatDate(data.orderDetails.dateTo)}</div>
  `;

  datesRow.appendChild(pickupDate);
  datesRow.appendChild(returnDate);
  container.appendChild(datesRow);

  // VEHICLE INFO
  const vehicleBox = document.createElement("div");
  vehicleBox.style.border = "1px solid #e0e0e0";
  vehicleBox.style.padding = "12px";
  vehicleBox.style.borderRadius = "6px";
  vehicleBox.style.background = "#f9f9f9";
  vehicleBox.style.marginBottom = "20px";
  vehicleBox.innerHTML = `
    <div style="font-weight: bold; font-size: 12px; margin-bottom: 8px; color: #3478f6;">${
      t.vehicleInfo
    }</div>
    <div style="font-size: 10px; line-height: 1.6;">
      <div><strong>${data.carDetails.carName || "-"}</strong></div>
      <div><strong>${t.model}:</strong> ${data.carDetails.model || "-"}</div>
      <div><strong>${t.type}:</strong> ${data.carDetails.type || "-"}</div>
      <div><strong>${t.transmission}:</strong> ${
    data.carDetails.transmission || "-"
  }</div>
    </div>
  `;
  vehicleBox.style.textAlign = locale === "ar" ? "right" : "left";
  container.appendChild(vehicleBox);

  // INVOICE TABLE
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.marginBottom = "20px";
  table.style.fontSize = "10px";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.style.background = "#3478f6";
  headerRow.style.color = "#fff";

  const headers = [t.description, t.days, t.rate, t.amount];
  headers.forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    th.style.padding = "8px";
    th.style.textAlign = locale === "ar" ? "right" : "left";
    th.style.fontWeight = "bold";
    if (locale === "ar") {
      headerRow.insertBefore(th, headerRow.firstChild);
    } else {
      headerRow.appendChild(th);
    }
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  // Car Rental Row
  let row1 = document.createElement("tr");
  row1.style.borderBottom = "1px solid #e0e0e0";
  const dailyRate = (data.orderDetails.totalPrice ?? 0) / (data.orderDetails.rentDays || 1);
  const cells1 = [
    t.carRental,
    String(data.orderDetails.rentDays || 0),
    formatCurrency(dailyRate),
    formatCurrency(data.orderDetails.totalPrice),
  ];
  cells1.forEach((cell) => {
    const td = document.createElement("td");
    td.textContent = cell;
    td.style.padding = "8px";
    td.style.textAlign = locale === "ar" ? "right" : "left";
    if (locale === "ar") {
      row1.insertBefore(td, row1.firstChild);
    } else {
      row1.appendChild(td);
    }
  });
  tbody.appendChild(row1);

  // Protection Fee Row
  let row2 = document.createElement("tr");
  row2.style.borderBottom = "1px solid #e0e0e0";
  const cells2 = [
    t.protectionFee,
    "1",
    formatCurrency(data.invoiceDetails.charges.protectionFee),
    formatCurrency(data.invoiceDetails.charges.protectionFee),
  ];
  cells2.forEach((cell) => {
    const td = document.createElement("td");
    td.textContent = cell;
    td.style.padding = "8px";
    td.style.textAlign = locale === "ar" ? "right" : "left";
    if (locale === "ar") {
      row2.insertBefore(td, row2.firstChild);
    } else {
      row2.appendChild(td);
    }
  });
  tbody.appendChild(row2);

  // Additional Services
  if (data.invoiceDetails.paymentInfoDetalis?.length) {
    for (const service of data.invoiceDetails.paymentInfoDetalis) {
      let srvRow = document.createElement("tr");
      srvRow.style.borderBottom = "1px solid #e0e0e0";
      const srvCells = [
        service.carServiceName || "-",
        "1",
        formatCurrency(service.carServicePrice),
        formatCurrency(service.carServicePrice),
      ];
      srvCells.forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = cell;
        td.style.padding = "8px";
        td.style.textAlign = locale === "ar" ? "right" : "left";
        if (locale === "ar") {
          srvRow.insertBefore(td, srvRow.firstChild);
        } else {
          srvRow.appendChild(td);
        }
      });
      tbody.appendChild(srvRow);
    }
  }

  table.appendChild(tbody);
  container.appendChild(table);

  // TOTALS SECTION
  const totalsDiv = document.createElement("div");
  totalsDiv.style.marginBottom = "20px";
  totalsDiv.style.fontSize = "10px";
  totalsDiv.style.lineHeight = "1.8";

  const totalRows = [
    {
      label: t.carRental,
      value: formatCurrency(data.orderDetails.totalPrice),
    },
  ];

  // Add protection fee if it exists
  if (data.invoiceDetails.charges?.protectionFee) {
    totalRows.push({
      label: t.protectionFee,
      value: formatCurrency(data.invoiceDetails.charges.protectionFee),
    });
  }

  // Add additional services if they exist
  if (data.invoiceDetails.paymentInfoDetalis?.length) {
    const servicesTotal = data.invoiceDetails.paymentInfoDetalis.reduce(
      (sum, service) => sum + (service?.carServicePrice || 0),
      0
    );
    if (servicesTotal > 0) {
      totalRows.push({
        label: t.additionalServices,
        value: formatCurrency(servicesTotal),
      });
    }
  }

  // Add paid amount if it exists
  if (data.orderDetails.webSiteAmount != null && data.orderDetails.webSiteAmount > 0) {
    totalRows.push({
      label: t.paidAmount,
      value: formatCurrency(data.orderDetails.webSiteAmount),
      color: "#22C55E",
    });
  }

  // Calculate remaining amount
  const remaining =
    (data.orderDetails.totalPrice ?? 0) -
    (data.orderDetails.webSiteAmount ?? 0);
  if (remaining > 0) {
    totalRows.push({
      label: t.remainingAmount,
      value: formatCurrency(remaining),
      color: "#DC3545",
    });
  }

  totalRows.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.style.display = "flex";
    rowDiv.style.justifyContent = "space-between";
    rowDiv.style.paddingRight = "10px";
    if (row.color) {
      rowDiv.style.color = row.color;
      rowDiv.style.fontWeight = "bold";
    }
    rowDiv.innerHTML = `<span>${row.label}</span><span>${row.value}</span>`;
    totalsDiv.appendChild(rowDiv);
  });

  // Total Amount (highlighted)
  const totalDiv = document.createElement("div");
  totalDiv.style.display = "flex";
  totalDiv.style.justifyContent = "space-between";
  totalDiv.style.paddingRight = "10px";
  totalDiv.style.marginTop = "8px";
  totalDiv.style.paddingTop = "8px";
  totalDiv.style.borderTop = "2px solid #3478f6";
  totalDiv.style.fontWeight = "bold";
  totalDiv.style.fontSize = "12px";
  totalDiv.style.color = "#3478f6";
  totalDiv.innerHTML = `
    <span>${t.totalAmount}</span>
    <span>${formatCurrency(data.orderDetails.totalPrice)}</span>
  `;
  totalsDiv.appendChild(totalDiv);

  container.appendChild(totalsDiv);

  // FOOTER
  const footer = document.createElement("div");
  footer.style.marginTop = "20px";
  footer.style.paddingTop = "15px";
  footer.style.borderTop = "1px solid #e0e0e0";
  footer.style.fontSize = "9px";
  footer.style.color = "#666";
  footer.style.textAlign = "center";
  footer.innerHTML = `
    <div style="margin-bottom: 4px;">${t.thankYou}</div>
    <div style="margin-bottom: 4px;">
      ${t.support}: ${data.vendorDetails.email || "-"} | ${
    data.vendorDetails.phoneNumber || "-"
  }
    </div>
    <div>${t.visitUs}: www.getcar.sa</div>
  `;
  container.appendChild(footer);

  document.body.appendChild(container);

  // Convert to canvas
  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    allowTaint: true,
  });

  document.body.removeChild(container);

  // Create PDF
  const imgData = canvas.toDataURL("image/jpeg", 0.98);
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let positionY = margin;

  doc.addImage(imgData, "JPEG", margin, positionY, imgWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    doc.addPage();
    positionY = margin - (imgHeight - heightLeft);
    doc.addImage(imgData, "JPEG", margin, positionY, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  return doc;
};
