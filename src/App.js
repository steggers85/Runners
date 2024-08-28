import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./App.css";

const initialData = [
  {
    name: "Leeroy",
    day1: 0,
    day2: 0,
    day3: 0,
    day4: 0,
    day5: 0,
    day6: 0,
    day7: 0,
  },
  {
    name: "Kaz",
    day1: 0,
    day2: 0,
    day3: 0,
    day4: 0,
    day5: 0,
    day6: 0,
    day7: 0,
  },
  {
    name: "Dave",
    day1: 0,
    day2: 0,
    day3: 0,
    day4: 0,
    day5: 0,
    day6: 0,
    day7: 0,
  },
  {
    name: "Billy",
    day1: 0,
    day2: 0,
    day3: 0,
    day4: 0,
    day5: 0,
    day6: 0,
    day7: 0,
  },
  {
    name: "Baz",
    day1: 0,
    day2: 0,
    day3: 0,
    day4: 0,
    day5: 0,
    day6: 0,
    day7: 0,
  },
  {
    name: "Steggs",
    day1: 0,
    day2: 0,
    day3: 0,
    day4: 0,
    day5: 0,
    day6: 0,
    day7: 0,
  },
];

function App() {
  const [rowData, setRowData] = useState(() => {
    const savedData = localStorage.getItem("rowData");
    return savedData ? JSON.parse(savedData) : initialData;
  });

  const [startDate, setStartDate] = useState(() => {
    const savedDate = localStorage.getItem("startDate");
    return savedDate ? new Date(savedDate) : new Date();
  });

  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem("columns");
    if (savedColumns) {
      return JSON.parse(savedColumns);
    }

    const dayColumns = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const shortDate = `${day.getDate()}/${day.getMonth() + 1}`;
      dayColumns.push({
        headerName: `Day ${i + 1}\n${shortDate}`,
        field: `day${i + 1}`,
        editable: true,
        width: 120,
        sortable: false,
        cellStyle: { whiteSpace: 'pre-line' },
        suppressMovable: true, // added this line
      });
    }
    return [
      {
        headerName: "Name",
        field: "name",
        editable: false,
        pinned: "left",
        width: 120,
        sortable: false,
        autoHeight: true,
        cellStyle: { whiteSpace: 'normal', textAlign: 'center' },
        suppressMovable: true, // added this line
      },
      ...dayColumns,
    ];
  });

  useEffect(() => {
    const updateColumns = () => {
      const savedColumns = localStorage.getItem("columns");
      if (savedColumns) {
        setColumns(JSON.parse(savedColumns));
        return;
      }
  
      const dayColumns = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        const shortDate = `${day.getDate()}/${day.getMonth() + 1}`;
        dayColumns.push({
          headerName: `Day ${i + 1}\n${shortDate}`,
          field: `day${i + 1}`,
          editable: true,
          width: 120,
          sortable: false,
          cellStyle: { whiteSpace: 'pre-line' },
          suppressMovable: true,
        });
      }
      setColumns([
        {
          headerName: "Name",
          field: "name",
          editable: false,
          pinned: "left",
          width: 150,
          sortable: false,
          autoHeight: true,
          cellStyle: { whiteSpace: 'normal', textAlign: 'center' },
          suppressMovable: true,
        },
        ...dayColumns,
      ]);
    };
    updateColumns();
  }, [startDate]);

  const addDayColumn = () => {
    const lastDayColumn = columns.filter((column) => column.field.startsWith("day")).pop();
    const lastDayNumber = parseInt(lastDayColumn.field.replace("day", ""));
    const newDayNumber = lastDayNumber + 1;
  
    // Find the date of the last day column
    const lastDayDate = new Date(startDate);
    lastDayDate.setDate(startDate.getDate() + lastDayNumber - 1);
  
    // Calculate the new day date
    const newDay = new Date(lastDayDate);
    newDay.setDate(lastDayDate.getDate() + 1);
    const shortDate = `${newDay.getDate()}/${newDay.getMonth() + 1}`;
  
    const newColumns = [
      ...columns,
      {
        headerName: `Day ${newDayNumber}\n${shortDate}`,
        field: `day${newDayNumber}`,
        editable: true,
        width: 120,
        sortable: false,
        cellStyle: { whiteSpace: 'pre-line', color: 'grey' }, // Set text color to grey
        suppressMovable: true,
      },
    ];
  
    const newRowData = rowData.map((row) => ({ ...row, [`day${newDayNumber}`]: 0 }));
  
    setColumns(newColumns);
    setRowData(newRowData);
    localStorage.setItem("columns", JSON.stringify(newColumns)); // Save columns to localStorage
    localStorage.setItem("rowData", JSON.stringify(newRowData)); // Save rowData to localStorage
  };

  const onCellValueChanged = (params) => {
    const updatedRowData = rowData.map((row) => {
      if (row.name === params.data.name) {
        return { ...row, [params.column.colId]: params.value };
      }
      return row;
    });
    setRowData(updatedRowData);
    localStorage.setItem("rowData", JSON.stringify(updatedRowData));
  };

  const totalRunsData = rowData.map((runner) => ({
    name: runner.name,
    total: Object.keys(runner)
      .filter((key) => key.startsWith("day"))
      .reduce((sum, key) => sum + Number(runner[key]), 0),
  }));

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setStartDate(newDate);
    localStorage.setItem("startDate", newDate.toISOString());
  };

  return (
    <div className="App">
      <header className="App-header rounded">
        <h1>The Runners</h1>
        <div className="header-controls">
  <input
    type="date"
    value={startDate.toISOString().substr(0, 10)}
    onChange={handleDateChange}
  />
  <button style={{ marginLeft: '40px' }} onClick={addDayColumn}>Add Day</button>
</div>
        <div className="ag-theme-alpine" style={{ height: 320 }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columns}
            onCellValueChanged={onCellValueChanged}
          />
        </div>
        <h2>Total Runs in KM</h2>
        <div className="bar-chart">
          <BarChart
            width={400}
            height={300}
            data={totalRunsData}
            margin={{
              top: 0,
              right: 5,
              left: 5,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="10 3" />
            <XAxis dataKey="name" />
            <YAxis /> <Tooltip />
            <Legend formatter={(value) => value === 'total' ? 'Total' : value} />
            <Bar dataKey="total" fill="#8884d8">
              {totalRunsData.map((entry, index) => (
                <LabelList
                  key={entry.name}
                  dataKey="total"
                  position="inside"
                  style={{ fill: "white" }}
                />
              ))}
            </Bar>
          </BarChart>
        </div>
      </header>
    </div>
  );
}

export default App;