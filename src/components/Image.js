// item.urls.small: 응답으로 받아오는 데이터 중 small size의 이미지 링크가 있는 속성

function Image({ item }) {
  return (
    <div>
      <img src={item.urls.small} alt="" />
    </div>
  )
}

export default Image;