const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

async function createPDF(data){

  // Reading the templates HTML
  var templateHtml = fs.readFileSync(path.join(process.cwd(), 'template.html'), 'utf8');
  
  var template = handlebars.compile(templateHtml);
  
  // Passing the ctx data
	var html = template(data);

	var milis = new Date();
	milis = milis.getTime();

  // Path where pdf will be created
	var pdfPath = path.join('./', `${data.name}-${milis}.pdf`);

  // puppeteer options for pdf
	var options = {
		width: '1230px',
		headerTemplate: "<p></p>",
		footerTemplate: "<p></p>",
		displayHeaderFooter: false,
		margin: {
			top: "10px",
			bottom: "30px"
		},
		printBackground: true,
		path: pdfPath
	}

	const browser = await puppeteer.launch();

	var page = await browser.newPage();
	
	await page.goto(`data:text/html;charset=UTF-8,${html}`, {
		waitUntil: 'networkidle0'
	});

	await page.pdf(options);
	await browser.close();
}

const data = {
	title: "A new Brazilian School",
	date: "05/12/2018",
	name: "Rodolfo Luis Marcos",
	age: 28,
	birthdate: "12/07/1990",
	course: "Computer Science",
	obs: "Graduated in 2014 by Federal University of Lavras, work with Full-Stack development and E-commerce."
}

createPDF(data);