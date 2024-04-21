import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { MdDelete } from "react-icons/md";
  
  const DeleteAlertDialog = ({ listingId, handleDelete }: { listingId: string, handleDelete: (listingId: string) => void }) => {
    const confirmDelete = () => {
      handleDelete(listingId);
    };
  
    return (
      <AlertDialog>
        <AlertDialogTrigger className="flex items-center justify-center p-3">
          <button className="p-2 bg-red-500 rounded-full">
            <MdDelete className="text-white" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this listing and it can never be restored again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default DeleteAlertDialog;
  