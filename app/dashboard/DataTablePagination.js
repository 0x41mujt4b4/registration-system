import React, { useState } from "react";
import { Button } from "@/components/ui/button";

function App() {
    const rowsPerPage = 10;
    const [data, setData] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(rowsPerPage);
}


function DataTablePagination({table, data}) {
    const rowsPerPage = 10;
    // [data, setData] = useState(data);
    // [startIndex, setStartIndex] = useState(0);
    // [endIndex, setEndIndex] = useState(rowsPerPage);
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default DataTablePagination;
