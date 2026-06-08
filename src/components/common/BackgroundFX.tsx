const BackgroundFX = () => {
  return (
    <>
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blob bg-blob--1" />
        <div className="bg-blob bg-blob--2" />
        <div className="bg-blob bg-blob--3" />
      </div>
      <div className="bg-grain" aria-hidden="true" />
    </>
  );
};

export default BackgroundFX;
