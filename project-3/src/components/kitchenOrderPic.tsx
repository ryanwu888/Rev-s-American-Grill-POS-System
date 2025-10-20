import Image from "next/image";

/**
 * Interface representing an order.
 */
interface Order {
  id?: number;
  products?: OrderItem[];
  complete?: boolean;
  time?: Date;
}

/**
 * Interface representing an order item.
 */
interface OrderItem {
  name: string;
  quantity: Number;
}

/**
 * Component displaying a blank kitchen order picture.
 * @returns JSX.Element
 */
function BlankKitchenOrderPic() {
  return (
    <div className="bg-primary text-red-950 flex items-center justify-center text-center font-bold rounded-md p-24 w-[28em] h-[28em]">
      Select an Order!
    </div>
  );
}

/**
 * Component displaying a filled kitchen menu picture.
 * @param params - Props containing the order ID.
 * @returns JSX.Element
 */
function FilledKitchenMenuPic(params: { id?: Number }) {
  return <h1>Order {params.id?.toString()} </h1>;
}

/**
 * Component for displaying a kitchen order picture.
 * @param params - Props containing the order data.
 * @returns JSX.Element
 */
export default function KitchenOrderPic(params: Order) {
  return (
    <div>
      {params ? (
        <FilledKitchenMenuPic id={params.id}></FilledKitchenMenuPic>
      ) : (
        <BlankKitchenOrderPic></BlankKitchenOrderPic>
      )}
    </div>
  );
}
