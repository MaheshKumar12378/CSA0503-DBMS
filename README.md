# Video Game Regional Sales Analytics

A responsive student-project analytics dashboard for exploring video game sales across North America, Europe, Japan and Other regions.

## Run the website

1. Extract the project ZIP.
2. Open the `GameScope-Website` folder in Visual Studio Code.
3. Install the **Live Server** extension if it is not already installed.
4. Right-click `index.html` and choose **Open with Live Server**.
5. Keep an internet connection available for the Chart.js and Google Fonts CDN resources.

You can also open `index.html` directly in a modern browser. Live Server is recommended.

## Website modules

- **Dashboard:** sales KPIs, regional and genre charts, top-selling games, and automatically generated insights.
- **Dataset:** search, genre/region filters, add, edit, delete, reset, CSV import and CSV export.
- **SQL Report:** select predefined report examples and view their result table and chart.
- **Database Explorer:** inspect the logical database tables, columns and example rows.
- **Database Schema:** view the entity relationship model and table relationships.
- **Visualization:** ten chart views with a selectable sales region.
- **Backup:** download the current browser dataset as a JSON backup.
- **Print report:** print the dashboard view or save it as PDF using the browser print dialog.

## Dataset and browser storage

The included 15 game records are fictional illustrative examples. They are not official market research data. Dataset edits are saved in the current browser's local storage and are not automatically shared between computers or browsers. Use **Backup** to save a JSON copy.

### CSV import format

CSV import replaces the current dataset after confirmation. Include these headers (case-insensitive):

```csv
Name,Platform,Year,Genre,Publisher,NA,EU,JP,Other
Example Game,PC,2024,Action,Example Studio,1.2,0.8,0.3,0.2
```

Sales values are in millions. Global sales are calculated as NA + EU + JP + Other.

## MySQL schema

`schema.sql` contains a MySQL relational schema for platforms, genres, publishers, games and regional sales. You can run it in MySQL Workbench or the MySQL command line after creating/selecting your database.

**Important:** the current website is a front-end local demo. Its SQL Report page runs predefined report calculations in JavaScript; it does not send arbitrary SQL to MySQL. To make the SQL editor execute real database queries, add a backend API (for example, Node.js + Express + MySQL) and connect the front end to that API.

## Project team

- B. Mahesh Kumar (1925260023)
- Levi J (1920260135)
- Sam Rufus Antly J.P (1912260452)
