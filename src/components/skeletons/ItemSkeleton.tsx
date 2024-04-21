const ItemSkeleton = ({ value }: { value: number }) => {
    const skeletons = [];
    for (let i = 0; i < value; i++) {
      skeletons.push(
        <div key={i} className='w-[400px] h-[100px] bg-gray-200 rounded-3xl animate-pulse'></div>
      );
    }
  
    return (
      <div className={`grid tablet:grid-cols-2 laptop:grid-cols-${value} gap-3`}>
        {skeletons}
      </div>
    );
  }
  
  export default ItemSkeleton;
  