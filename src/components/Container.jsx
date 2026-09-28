export default function Container({ wide = false, className = "", children, as: Tag = "div" }) {
  return <Tag className={`${wide ? "container-wide" : "container-site"} ${className}`}>{children}</Tag>;
}
