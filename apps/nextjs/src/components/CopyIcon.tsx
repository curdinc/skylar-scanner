import {
  Box,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Check, Copy, type LucideIcon } from "lucide-react";

interface iconTypes {
  icon: LucideIcon;
  size: string;
}
export const IconDefault = ({ icon, size }: iconTypes) => {
  return (
    <Box
      as={icon}
      sx={{
        width: `var(--chakra-fontSizes-${size})`,
        height: `var(--chakra-fontSizes-${size})`,
      }}
    />
  );
};
interface props {
  content: string;
  size: string;
}
export const CopyPopover = ({ content, size }: props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton
          aria-label="copy"
          variant="ghost"
          _hover={{ backgroundColor: "transparent" }}
          isDisabled={isOpen}
          size={"1"}
          onClick={() => {
            onOpen();
            navigator.clipboard.writeText(content).catch((e) => {
              console.error("ERROR: Copying to clipboard failed.", e);
            });
            setTimeout(() => {
              onClose();
            }, 1500);
          }}
          icon={
            isOpen ? (
              <IconDefault icon={Check} size={size} />
            ) : (
              <IconDefault icon={Copy} size={size} />
            )
          }
        />
      </PopoverTrigger>

      <Box
        as={PopoverContent}
        width={"fit-content"}
        _focusVisible={{
          boxShadow: "none",
        }}
      >
        <PopoverArrow />
        <PopoverBody>
          <Text>Copied to clipboard!</Text>
        </PopoverBody>
      </Box>
    </Popover>
  );
};
