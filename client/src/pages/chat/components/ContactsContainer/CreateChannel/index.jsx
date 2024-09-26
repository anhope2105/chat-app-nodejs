import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTES,
} from "@/utils/constant";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

const CreateChannel = () => {
  const { setSelectedChatData, setSelectedChatType, addChannel } =
    useAppStore();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [listAllContacts, setListAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
          withCredentials: true,
        });
        console.log(res.data);

        setListAllContacts(res.data.contacts);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.length && selectedContacts.length) {
        const res = await apiClient.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          { withCredentials: true }
        );
        if (res.status === 200) {
          console.log(res.data.channel);

          setChannelName("");
          setSelectedContacts([]);
          setIsOpenModal(false);
          addChannel(res.data.channel);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 transition-all duration-300 cursor-pointer"
              onClick={() => setIsOpenModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Chọn liên lạc
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Vui lòng nhập tên kênh</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Tên kênh"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg py-2 bg-[#2c2e3b] border-none"
              defaultOptions={listAllContacts}
              value={selectedContacts}
              onChange={setSelectedContacts}
              placeholder="Vui lòng chọn"
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  Trống
                </p>
              }
            />
          </div>
          <Button
            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={createChannel}
          >
            Tạo kênh
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
