import React, { useState, useEffect } from "react";
import db from "../../../../database/firebase";
import Link from "next/link";
import { useRouter } from "next/router";

export const getServerSideProps = async ({ query }) => {
  const content = {};
  content["main_id"] = query.id;

  return {
    props: {
      main_id: content.main_id,
    },
  };
};

const history = (props) => {
  const [historys, setHistorys] = useState([]);
  const router = useRouter();

  useEffect(() => {
    db.collection("herbs")
      .doc(props.main_id)
      .collection("historys")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        const history = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistorys(history);
      });
  }, []);

  return (
    <div className="container">
      <div style={{ textAlign: "center" }}>
        <h1>history</h1>
        {historys.map((history) => (
          <li key={history.id}>
            <Link
              href="../../../herb/[id]/history/detail/[detail_id]"
              as={
                "../../../herb/" +
                props.main_id +
                "/history/detail/" +
                history.id
              }
            >
              <a>
                {history.thaiName}&nbsp;&nbsp;
                {new Date(history.timestamp.seconds * 1000).toDateString()}
              </a>
            </Link>
          </li>
        ))}
        <br />
        <br />
        <button onClick={() => router.back()}>
          <a>Back</a>
        </button>
      </div>
    </div>
  );
};

export default history;
