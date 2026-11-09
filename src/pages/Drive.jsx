// https://youtu.be/3X__DaWC3mY?t=10625

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { FileGrid } from '@/components/files/FileGrid';
import { useApp } from '@/context/AppContext';
import { useDrive } from '@/hooks/useDrive';
import { FilePreview } from '@/components/files/FilePreview';
import { ShareModal } from '@/components/files/ShareModal';
import { RenameModal } from '@/components/files/RenameModal';
import { MoveModal } from '@/components/files/MoveModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export const Drive = () => {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const { fetchDriveContent, setCurrentFolderId } = useApp();
  const { deleteItem: removeDriveItem } = useDrive();

  // Active item modals
  const [previewFile, setPreviewFile] = useState(null);
  const [shareItem, setShareItem] = useState(null);
  const [renameItem, setRenameItem] = useState(null);
  const [moveItem, setMoveItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    const id = folderId || null;
    setCurrentFolderId(id);
    fetchDriveContent(id);
  }, [folderId, fetchDriveContent, setCurrentFolderId]);

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    await removeDriveItem(deleteItem);
    setDeleteItem(null);
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* folder & files */}
      <FileGrid
        onFolderClick={(folder) => navigate(`/drive/${folder.id}`)}
        onPreviewFile={setPreviewFile}
        onShareItem={setShareItem}
        onRenameItem={setRenameItem}
        onMoveItem={setMoveItem}
        onDeleteItem={setDeleteItem}
      />

      {/* Modals */}
      {previewFile && <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />}
      {shareItem && (
        <ShareModal item={shareItem} isOpen={!!shareItem} onClose={() => setShareItem(null)} />
      )}
      {renameItem && (
        <RenameModal item={renameItem} isOpen={!!renameItem} onClose={() => setRenameItem(null)} />
      )}
      {moveItem && (
        <MoveModal item={moveItem} isOpen={!!moveItem} onClose={() => setMoveItem(null)} />
      )}
      {deleteItem && (
        <ConfirmDialog
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleConfirmDelete}
          title={`Moved ${deleteItem.name} to Trash?`}
          message="You can restore this item form Trash at any time."
          confirmText="Move to Trash"
        />
      )}
    </div>
  );
};
