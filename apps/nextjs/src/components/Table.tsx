import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

export function DataTable({
  headers,
  data,
}: {
  headers: string[];
  data: Array<any>;
}) {
  const borderColor = useColorModeValue("gray.200", "darkColor.600");
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            {headers.map((header) => (
              <Th key={header} borderColor={borderColor} color="gray.300">
                {header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr key={index}>
              {Object.keys(item).map((key) => (
                <Td key={key} borderColor={borderColor} color="gray.400">
                  {typeof item[key] === "string" ||
                  typeof item[key] === "bigint"
                    ? item[key].toString()
                    : item[key]}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr></Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
}
