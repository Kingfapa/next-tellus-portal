import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Grid,
  Center,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import React from "react";
import { useState, useEffect } from "react";
import { IPhoneNumberApiResponse } from "src/pages/api/phoneNumbers";

export interface IPhoneNumberBoxProps {
  name: string;
  number: string;
}

const PhoneNumberBox: React.FC<IPhoneNumberBoxProps> = (props) => (
  <LinkBox
    borderWidth="1px"
    rounded="md"
    transition="all"
    transitionDuration="0.3s"
    borderBottomColor={"twitter.700"}
  >
    <LinkOverlay href="tel:082">
      <Center py="2" px="3" flexDir={"column"}>
        <Text>{props.name}</Text>
        <Text>{props.number}</Text>
      </Center>
    </LinkOverlay>
  </LinkBox>
);

export const PhoneModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [phoneNumbers, setPhoneNumbers] = useState<IPhoneNumberBoxProps[]>([]);

  useEffect(() => {
    const getPhoneNumbers = async () => {
      const response = await fetch("/api/phoneNumbers");
      setPhoneNumbers(
        ((await response.json()) as IPhoneNumberApiResponse).records
      );
    };

    getPhoneNumbers();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px" borderColor="inherit">
          Serviceförvaltningens Servicedesk
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid gap="4">
            {phoneNumbers &&
              phoneNumbers.map((phoneInfo) => (
                <PhoneNumberBox key={phoneInfo.name} {...phoneInfo} />
              ))}
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Stäng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
