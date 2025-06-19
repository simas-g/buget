export default function BankOption({ logo, name }) {
  return (
    <li className="flex border-b max-w-xl w-full border-gray-300 px-4 py-5 gap-4 items-center">
      <div className="w-10 h-10 rounded-lg overflow-hidden">
        <img src={logo} className=" h-full" alt="" />
      </div>
      <button className="underline underline-offset-2 cursor-pointer">{name}</button>
    </li>
  );
}
