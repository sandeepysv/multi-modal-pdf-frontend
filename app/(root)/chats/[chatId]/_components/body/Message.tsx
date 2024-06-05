import Link from "next/link";
import React from "react";

type Props = {
  name: string;
  content: string;
};

const Message = ({ name, content }: Props) => {
  return (
    <div>
      <b className="capitalize">{name}: </b>
      {name === "user" ? (
        content
      ) : (
        <Link href={content} target="_blank" className="text-blue-600">
          Download PDF
        </Link>
      )}
    </div>
  );
};

export default Message;
