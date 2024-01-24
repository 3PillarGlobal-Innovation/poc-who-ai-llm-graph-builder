
export default function Loader() {
    return <div
      className="n-flex n-flex-col n-justify-center n-items-center n-gap-y-2"
    >
      <div
        className="ndl-spin-wrapper ndl-large"
        role="status"
        aria-label="Loading content"
        aria-live="polite"
      >
        <div className="ndl-spin"></div>
      </div>
      <div>Uploading</div>
    </div>
  }