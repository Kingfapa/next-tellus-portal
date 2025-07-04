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
  UnorderedList,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Link,
} from "@chakra-ui/react";
import React from "react";

export const InfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px" borderColor="inherit">
          Kontaktformulär för Serviceförvaltningen
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Kontaktformuläret</Tab>
              <Tab>SAM och Regionalt Nät</Tab>
              <Tab>eTjänstekort</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Text>
                  Detta kontaktformulär når du när du inte är ansluten till
                  Region Stockholms nätverk Regionalt Nät.
                </Text>
                <Text>
                  Vill du komma åt Serviceförvaltningens portal via
                  tellus.sll.se krävs det att du ansluter dig till Regionalt
                  Nät.
                </Text>
                <br />
                <Text as="u">
                  Observera att inloggning i portalen kräver eTjänstekort.
                </Text>
                <br />
                <br />
                Du får då möjlighet att:
                <UnorderedList>
                  <ListItem>Beställa och administrera tjänster</ListItem>
                  <ListItem>Anmäla ärenden till Serviceförvaltningen</ListItem>
                  <ListItem>Följa dina pågående och stängda ärenden</ListItem>
                  <ListItem>Ta del av kunskapsartiklar och FAQ</ListItem>
                </UnorderedList>
              </TabPanel>
              <TabPanel>
                <Text as="b">Anställd inom Region Stockholm</Text>
                <Text>
                  Är du anställd via Region Stockholm kommer du åt Regionalt Nät
                  via din arbetsplats. Arbetar du från distans kräver anslutning
                  ett SAM-konto. Kontakta din närmaste chef för att få hjälp med
                  hur du ansluter dig till Regionalt Nät utanför din
                  arbetsplats.
                </Text>
                <br />
                <Text as="b">
                  Kommunalanställda samt Privata vårdgivare med vårdavtal
                </Text>
                <Text>
                  För att nå Regionalt Nät krävs det att din arbetsplats är
                  ansluten till Regionalt Nät eller att du kopplar upp dig via
                  SAM-tjänsten.
                </Text>
              </TabPanel>
              <TabPanel>
                <Text as="b">Anställd inom Region Stockholm</Text>
                <Text>
                  Sök på "eTjänstekort" på din organisations intranät
                  alternativt kontakta din närmaste chef.
                </Text>
                <br />
                <Text as="b">
                  <Link
                    color={"blue.500"}
                    href="https://vardgivarguiden.se/it-stod/etjanstekort/information-om-e-tjanstekort-for-vardgivare/"
                    isExternal
                  >
                    Kommunalanställda samt Privata vårdgivare med vårdavtal
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                </Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
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
