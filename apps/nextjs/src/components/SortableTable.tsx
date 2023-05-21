import React, { useState } from "react";
import {
  Box,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TableData {
  id: number;
  name: string;
  age: number;
}

const initialData: TableData[] = [
  { id: 1, name: "John", age: 25 },
  { id: 2, name: "Jane", age: 30 },
  { id: 3, name: "Mike", age: 28 },
];

const SortableTable: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedColumn, setSortedColumn] = useState<"name" | "age">("name");

  const handleSort = (column: "name" | "age") => {
    if (column === sortedColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(column);
      setSortOrder("asc");
    }

    const sortedData = [...data].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[column] - b[column];
      } else {
        return b[column] - a[column];
      }
    });

    setData(sortedData);
  };

  return (
    <Box p={4}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>
              Name
              <IconButton
                icon={
                  sortOrder === "asc" ? (
                    <ChevronDown css={{ background: "transparent" }} />
                  ) : (
                    <ChevronUp />
                  )
                }
                aria-label="Sort Name"
                onClick={() => handleSort("name")}
                ml={2}
              />
            </Th>
            <Th>
              Age
              <IconButton
                icon={sortOrder === "asc" ? <ChevronDown /> : <ChevronUp />}
                aria-label="Sort Age"
                onClick={() => handleSort("age")}
                ml={2}
              />
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr key={item.id}>
              <Td>{item.name}</Td>
              <Td>{item.age}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default SortableTable;
