export default function LoadingUsers() {
   const numBars = 10;
   const bars = [];
   for (let i = 0; i < numBars; i++) {
      bars.push(<div key={i} className="bar"></div>);
   }
   return (
      <div className="loader">
         <div className="loader-item">{bars}</div>
      </div>
   );
}
