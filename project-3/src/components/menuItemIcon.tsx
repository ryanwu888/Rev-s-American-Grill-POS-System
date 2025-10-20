/**
 * A component that renders a table connected to a database with editability.
 * 
 * @param props The props passed to the component
 * @returns The Menu Itme Icons
 * @author Daniel Mota
 */
import Image from "next/image";

interface MenuItemIconParams {
  pic?: string; // URL of the image
  description?: string; // Description of the image
  name?: string; // Name of the menu item
  seasonal: boolean; // Indicates whether the menu item is seasonal
}

export default function MenuItemIcon(params: MenuItemIconParams) {
  return (
    <div>
      {/* Checking if pic and description props are provided */}
      {params.pic && params.description && (
        <div className="flex flex-col items-center justify-center bg-accent rounded-lg relative p-4">
          {/* Displaying the image */}
          <div className="p-2 bg-accent rounded-lg relative w-64 h-64">
            <Image
              src={params.pic} // Image source URL
              alt={params.description} // Image description
              className="rounded-md" // CSS class for styling
              layout="fill" // Specifies that the image should fill its container
            ></Image>
          </div>
          {/* Displaying the name of the menu item */}
          <h3 className="mt-1 font-bold">
            {params.name}{" "}
            {/* Displaying a message if the menu item is seasonal */}
            {params.seasonal && (
              <span className="text-red-500">(Seasonal item!)</span>
            )}
          </h3>
        </div>
      )}
    </div>
  );
}
