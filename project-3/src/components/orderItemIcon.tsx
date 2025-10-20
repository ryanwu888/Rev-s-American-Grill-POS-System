// Defining an interface for the props that the MenuItemIcon component accepts
interface OrderItemIconParams {
  id: Number; // ID of the order item
}

// Defining the MenuItemIcon component with the specified props
export default function MenuItemIcon(params: OrderItemIconParams) {
  return (
    <div>
      {/* Checking if the id prop is provided */}
      {params.id && (
        <div className="flex justify-center items-center p-2 bg-accent rounded-lg">
          {/* Displaying the order ID */}
          <p>Order {params.id.toString()}</p>
        </div>
      )}
    </div>
  );
}
