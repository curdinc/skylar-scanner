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
  const borderColor = useColorModeValue("gray.200", "black");
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            {headers.map((header) => (
              <Th key={header} borderColor={borderColor}>
                {header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr key={index}>
              {Object.keys(item).map((key) => (
                <Td key={key} borderColor={borderColor}>
                  {item[key]}
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
