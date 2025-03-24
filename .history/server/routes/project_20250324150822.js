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
  const employees = data.employee;
  const projects = data.project;
  const managers = data.manager;

  let result = [];
  let cid = 1;

  // Identify Department Manager (a manager who is not an employee)
  let dept_manager = managers.find(
    (mgr) => !employees.some((emp) => emp.emp_id === mgr.emp_id)
  );

  if (!dept_manager) {
    return res.status(404).json({ message: "Department manager not found" });
  }

  // Add Department Manager as Root Node
  let deptManagerId = cid++;
  result.push({
    id: deptManagerId,
    info: dept_manager,
    level: 0,
    emp_count: employees.length,
  });

  // Add ALL Projects under Department Manager
  projects.forEach((project) => {
    let projectId = cid++;
    result.push({
      id: projectId,
      info: project,
      parentId: deptManagerId, // All projects directly under dept manager
      level: 1,
    });

    // Add Lead under Project
    let lead = employees.find((emp) => emp.emp_id === project.lead);
    if (lead) {
      let leadId = cid++;
      result.push({
        id: leadId,
        info: lead,
        parentId: projectId,
        level: 2,
      });

      // Add Team Members under Lead
      employees
        .filter((emp) => emp.reports_to === lead.emp_id)
        .forEach((teamMember) => {
          result.push({
            id: cid++,
            info: teamMember,
            parentId: leadId,
            level: 3,
          });
        });
    }
  });

  res.json(result);
});


module.exports = router;
