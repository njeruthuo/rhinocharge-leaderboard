function CpColumnHeader({ cp }: { cp: string }) {
  return (
    <th className="text-center py-3 px-1" style={{ minWidth: 64 }}>
      <div
        className="text-[9px] font-black tracking-[0.15em] uppercase leading-none"
        style={{
          fontFamily: "'Oswald', sans-serif",
          color: "white",
        }}
      >
        {cp}
      </div>
    </th>
  );
}

export default CpColumnHeader;
