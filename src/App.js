import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "./components/Image";
import Loading from "./components/Loading";
import EndMessage from "./components/EndMessage";

function App() {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [items, setItems] = useState([]);
  const [hasMore, sethasMore] = useState(true);
  const [page, setpage] = useState(2);

  // 컴포넌트가 처음 나타났을 때(마운트되었을 때) 보여줄 이미지들을 요청합니다.
  useEffect(() => {
    const getImages = async () => {
      const res = await fetch(
        `https://api.unsplash.com/photos/?client_id=${API_KEY}&per_page=5`
      );
      const data = await res.json();
      setItems(data);
    };
    getImages();
  }, []);

  // 페이지 바닥에 닿았을 때 실행되는 함수
  const fetchImages = async () => {
    const res = await fetch(
      `https://api.unsplash.com/photos/?client_id=${API_KEY}&page=${page}&per_page=5`
    );
    const data = await res.json();
    return data;
  };

  const fetchData = async () => {
    const imagesFormServer = await fetchImages();
    // 기존의 값을 유지한 채 새로운 데이터를 추가해 렌더링되도록 해야 합니다.
    setItems([...items, ...imagesFormServer]);
    // 예를 들어 5개씩 데이터를 받아온다고 가정했습니다.
    // 만약 받아온 값이 5개 미만이면, 다음에 페이지 바닥에 닿으면 새로 불러올 데이터가 더이상 서버에 존재하지 않다는 것을 의미합니다.
    if (imagesFormServer.length < 5) {
      // 따라서 다음에 불러올 데이터가 더이상 없다는 것을 알리기 위해 hasMore state를 false로 업데이트합니다.
      sethasMore(false);
    }
    // 다음에 불러올 데이터가 남아있다면 page 숫자를 1 증가시켜줍니다.
    setpage(page + 1);
  };

  return (
    <InfiniteScroll
      dataLength={items.length} // next 함수를 호출할건지 말건지 결정하는 기준이 되는 length
      next={fetchData} // 바닥에 닿으면 실행되는 함수
      hasMore={hasMore} // hseMore가 false면 next를 실행하지 않습니다.
      loader={<Loading />} // 데이터를 불러오는 동안 보여주는 컴포넌트
      endMessage={<EndMessage />} // hasMore가 false일 때, 즉 더이상 보여줄 데이터가 없을 때 페이지 바닥에 보여줄 컴포넌트
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {items.map((item) => {
          return <Image key={item.id} item={item} />;
        })}
      </div>
    </InfiniteScroll>
  );
}

export default App;
