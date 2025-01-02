import pkg from "peerjs";
export default function () {
  const { Peer } = pkg;
  const peer = new Peer("a");
  const peer2 = new Peer("b");
  const conn = peer.connect("b");
  conn.on("open", () => {
    conn.send("hi!");
  });

  const conn2 = peer2.connect("a");
  conn2.on("open", () => {
    conn2.send("hi!");
  });
  conn2.on("data", (data) => {
    console.log(data);
  });
}
