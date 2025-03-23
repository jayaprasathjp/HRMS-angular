const { Router } = require("express");
const router = Router();
const fs = require("fs");
const path = require("path");
const PdfPrinter = require('pdfmake');
const authenticateToken = require("./authenticationToken");
const dataPath = path.join(__dirname, "../db/data.json");
const getData = () => JSON.parse(fs.readFileSync(dataPath, "utf8"));
const saveData = (data) =>
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");

router.get("/", authenticateToken, (req, res) => {
  const data = getData();
  const managerMap = {};
  data.manager.forEach((manager) => {
    managerMap[manager.emp_id] = manager.name;
  });
  setTimeout(() => {}, 6000);
  const employees = data.employee.map((emp) => ({
    ...emp,
    reports_to: managerMap[emp.reports_to] || emp.reports_to,
  }));
  res.json(employees);
});

router.post("/", (req, res) => {
  const data = getData();
  const newEmployee = req.body;
  data.employee.push(newEmployee);
  saveData(data);
  res.status(201).json({ message: "Employee added", employee: newEmployee });
});

router.put("/:emp_id", (req, res) => {
  const data = getData();
  const { emp_id } = req.params;
  const dataBody = req.body;

  const index = data.employee.findIndex((emp) => emp.emp_id == emp_id);

  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }

  data.employee[index] = { ...data.employee[index], ...dataBody };
  saveData(data);
  res.json({ message: "Employee updated", employee: data.employee[index] });
});

router.delete("/:emp_id", (req, res) => {
  const data = getData();
  const { emp_id } = req.params;

  const index = data.employee.findIndex((emp) => emp.emp_id == emp_id);
  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }
  const deletedEmployee = data.employee.splice(index, 1);
  saveData(data);
  res.json({ message: "Employee deleted", employee: deletedEmployee[0] });
});

router.get("/hie", (req, res) => {
  const data = getData();
  const managerMap = {};
  data.manager.forEach((manager) => {
    managerMap[manager.emp_id] = {
      id: manager.emp_id,
      name: manager.name,
      projects: [],
    };
  });
  data.project.forEach((project) => {
    if (managerMap[project.manager]) {
      managerMap[project.manager].projects.push(project.name);
    }
  });
  const result = Object.values(managerMap);

  res.json(result);
});

router.get("/org-chart", (req, res) => {
  const data = getData();
  const employee = data.employee;
  const project = data.project;
  const manager = data.manager;
  let dept_manager = {};
  const people_manager = [];
  result = [];
  let cid = 1;
  manager.forEach((mgr) => {
    flag = 0;
    employee.forEach((emp) => {
      if (mgr.emp_id == emp.emp_id) {
        people_manager.push(emp);
        flag = 1;
      }
    });
    if (flag == 0) dept_manager = mgr;
  });

  result.push({
    id: cid++,
    info: dept_manager,
    level: 0,
    emp_count: employee.length,
  });

  people_manager.forEach((mgr) => {
    let count = 0;
    employee.forEach((emp) => {
      if (emp.reports_to == mgr.emp_id && mgr.emp_id != emp.emp_id) {
        count++;
      }
    });
    result.push({
      id: cid++,
      info: mgr,
      parentId: 1,
      level: 1,
      emp_count: count,
    });
  });

  flag1 = 0;
  project.forEach((pro) => {
    if (pro.manager == dept_manager.emp_id) flag1 = 1;
  });
  if (flag1 == 1) {
    let count = 0;
    employee.forEach((emp) => {
      if (emp.reports_to == dept_manager.emp_id) {
        count++;
      }
    });
    result.push({
      id: cid++,
      info: dept_manager,
      parentId: 1,
      hidden: true,
      level: 1,
      emp_count: count - people_manager.length,
    });
  }

  project.forEach((pro) => {
    result.forEach((res) => {
      if (pro.manager == res.info.emp_id && res.level == 1) {
        result.push({
          id: cid++,
          info: pro,
          parentId: res.id,
          level: 2,
        });
      }
    });
  });

  project.forEach((pro) => {
    proId = 0;
    result.forEach((res) => {
      if (res.info.name == pro.name) {
        proId = res.id;
      }
    });
    employee.forEach((emp) => {
      if (pro.name == emp.project) {
        result.push({
          id: cid++,
          info: emp,
          parentId: proId,
          level: 3,
        });
      }
    });
  });
  res.json(result);
});
const fonts = {
  Roboto: {
    normal: 'node_modules/pdfmake/fonts/Roboto-Regular.ttf',
    bold: 'node_modules/pdfmake/fonts/Roboto-Medium.ttf',
    italics: 'node_modules/pdfmake/fonts/Roboto-Italic.ttf',
    bolditalics: 'node_modules/pdfmake/fonts/Roboto-MediumItalic.ttf'
  }
};

const printer = new PdfPrinter(fonts);
router.post("/generate-pdf", async (req, res) => {
  const jsonData = req.body; // Assuming JSON data comes from the request body

  // Convert JSON to table format
  const tableBody = [
    [
      { text: "Emp ID", bold: true },
      { text: "Name", bold: true },
      { text: "Role", bold: true },
      { text: "Department", bold: true },
      { text: "Project", bold: true },
      { text: "Reports To", bold: true },
      { text: "Email", bold: true },
      { text: "Phone", bold: true }
    ], // Table Header
    ...jsonData.map(user => [
      user.emp_id, 
      { text: user.name, alignment: "left" }, 
      { text: user.role, alignment: "left" }, 
      { text: user.department, alignment: "left" }, 
      { text: user.project, alignment: "left" }, 
      { text: user.reports_to || "N/A", alignment: "left" }, 
      { text: user.email, alignment: "left" }, 
      { text: user.phone, alignment: "left" }
    ]) // Table Rows
  ];

  const docDefinition = {
    content: [
      { text: "Employee Details", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "15%", "15%", "12%", "12%", "12%", "20%", "auto"], // Adjusted widths
          body: tableBody
        },
        layout: {
          fillColor: function (rowIndex) {
            return rowIndex % 2 === 0 ? "#f3f3f3" : null; // Alternating row colors
          }
        }
      }
    ],
    styles: {
      header: { fontSize: 16, bold: true, margin: [0, 0, 0, 10], alignment: "center" },
      tableStyle: { fontSize: 10, margin: [0, 5, 0, 15] } // Reduce font size
    },
    defaultStyle: {
      fontSize: 10, // Reduce font size globally
      columnGap: 5 // Reduce spacing between columns
    },
    pageSize: "A4", // Ensuring proper fit
    pageOrientation: "landscape", // Wider layout for more columns
    pageMargins: [20, 20, 20, 20] // Adjust margins for better fit
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  // Set response headers for instant download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="employee_details.pdf"');

  pdfDoc.pipe(res);
  pdfDoc.end();
});

module.exports = router;
