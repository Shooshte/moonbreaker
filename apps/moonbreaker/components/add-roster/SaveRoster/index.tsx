import styles from './SaveRoster.module.scss';

interface Props {
  canPublish: boolean;
  isSaving: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const SaveRoster = ({
  canPublish,
  isSaving,
  onSaveDraft,
  onPublish,
}: Props) => {
  return (
    <section className={styles.container}>
      <button
        className={`button`}
        disabled={!canPublish || isSaving}
        onClick={onPublish}
      >
        Publish
      </button>
      <button className={`button`} disabled={isSaving} onClick={onSaveDraft}>
        Save draft
      </button>
    </section>
  );
};

export default SaveRoster;
