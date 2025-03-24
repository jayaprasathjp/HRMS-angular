const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const PdfPrinter = require('pdfmake');
const router = Router();
const dataPath = path.join(__dirname, "../db/data.json");

const getData = () => JSON.parse(fs.readFileSync(dataPath, "utf8"));
const saveData = (data) =>
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");

router.get("/", (req, res) => {
  const data = getData();
  const managerMap = Object.fromEntries(
    data.manager.map((m) => [m.emp_id, m.name])
  );
  const employeeMap = Object.fromEntries(
    data.employee.map((e) => [e.emp_id, e.name])
  );
  const teamCountMap = data.employee.reduce((acc, emp) => {
    if (emp.project) {
      acc[emp.project] = (acc[emp.project] || 0) + 1;
    }
    return acc;
  }, {});
  
  const projects = data.project.map((pro) => ({
    ...pro,
    manager: managerMap[pro.manager] || pro.manager,
    lead: employeeMap[pro.lead] || pro.lead,
    team_count:teamCountMap[pro.name]
  }));

  res.json(projects);
});

router.post("/", (req, res) => {
  const data = getData();
  const newProject = req.body;
  data.project.push(newProject);
  saveData(data);
  res.status(201).json({ message: "Project added", project: newProject });
});


router.put("/:name", (req, res) => {
  const data = getData();
  const { name } = req.params;
  const dataBody = req.body;

  const index = data.project.findIndex((pro) => pro.name == name);

  if (index === -1) {
    return res.status(404).json({ message: "Project not found" });
  }

  data.project[index] = { ...data.project[index], ...dataBody };
  saveData(data);
  res.json({ message: "Project updated", project: data.project[index] });
});

router.delete("/:name", (req, res) => {
  const data = getData();
  const { name } = req.params;
  const index = data.project.findIndex((pro) => pro.name === name);

  console.log(name);
  if (index === -1) {
    return res.status(404).json({ message: "Project not found" });
  }

  data.project.splice(index, 1);
  saveData(data);

  res.json({ message: "Project deleted" });
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
  const jsonData = req.body; // JSON data from request

  // Convert JSON to table format
  const tableBody = [
    [
      { text: "Project Name", bold: true },
      { text: "Description", bold: true },
      { text: "Manager", bold: true },
      { text: "Lead", bold: true },
      { text: "Team Count", bold: true }
    ], // Table Header
    ...jsonData.map(project => [
      { text: project.name, alignment: "left" },
      { text: project.description, alignment: "left" },
      { text: project.manager, alignment: "left" },
      { text: project.lead, alignment: "left" },
      { text: project.team_count.toString(), alignment: "center" } // Convert number to string
    ]) // Table Rows
  ];

  const docDefinition = {
    content: [
      { text: "Project Details", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: ["20%", "30%", "20%", "20%", "10%"], // Adjust column widths
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
      header: { fontSize: 16, bold: true, margin: [0, 0, 0, 10], alignment: "center" }
    },
    defaultStyle: {
      fontSize: 10,
      columnGap: 5
    },
    pageSize: "A4",
    pageOrientation: "portrait", // Projects fit well in portrait mode
    pageMargins: [20, 20, 20, 20] // Adjust margins
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  // Set response headers for instant download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="project_details.pdf"');

  pdfDoc.pipe(res);
  pdfDoc.end();
});


router.get("/org-chart/project", (req, res) => {
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

module.exports = router;
