interface Props {
  url: string;
}

const Preview = ({ url }: Props) => {
  return (
    <div className="preview">
      {url ? <iframe src={url}></iframe> : <p>Loading</p>}
    </div>
  );
};

export default Preview;
