import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
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
        {headers.length !== 0 && (
          <Thead>
            <Tr>
              {headers.map((header) => (
                <Th key={header} borderColor={borderColor} color="gray.300">
                  {header}
                </Th>
              ))}
            </Tr>
          </Thead>
        )}
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

export function AccordianTable({
  headers,
  data,
  title,
}: {
  headers: string[];
  data: Array<any>;
  title: string;
}) {
  const bgcolor = useColorModeValue("gray.100", "darkColor.500");
  return (
    <Box rounded="md" bg={bgcolor}>
      <Accordion defaultIndex={[0]} rounded="md" allowMultiple>
        <AccordionItem border="none">
          <h1>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontSize="2xl"
                fontWeight="bold"
                padding="2"
              >
                {title}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h1>
          <AccordionPanel pb={4}>
            <DataTable headers={headers} data={data} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
