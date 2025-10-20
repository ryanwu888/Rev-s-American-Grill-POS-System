import Image from "next/image";

interface MenuItem {
  name?: string;
  pic?: string;
  price?: number;
  description?: string;
  seasonal?: boolean;
}

/**
 * Placeholder component for menu item picture.
 */
function BlankMenuItemPic() {
  return (
    <div className="bg-primary text-red-950 flex items-center justify-center text-center font-bold rounded-md p-24 w-[28em] h-[28em]">
      Select a Menu Item!
    </div>
  );
}

/**
 * Component to display a filled menu item picture.
 * 
 * @param pic The URL of the image
 * @param alt The alternative text for the image
 * @param seasonal Indicates if the menu item is seasonal
 */
function FilledMenuItemPic(params: {
  pic: string;
  alt: string;
  seasonal?: boolean;
}) {
  return (
    <div className="relative">
      {params.seasonal && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
          <span className="flex items-center justify-center w-full h-full">
            Seasonal product!
          </span>
        </div>
      )}
      <Image
        src={params.pic}
        alt={params.alt}
        width={400}
        height={400}
        className="rounded-md w-[28em] h-[28em]"
      />
    </div>
  );
}

/**
 * Main menu item picture component.
 * 
 * @param name The name of the menu item
 * @param pic The URL of the image
 * @param price The price of the menu item
 * @param description The description of the menu item
 * @param seasonal Indicates if the menu item is seasonal
 */
export default function MenuItemPic(params: MenuItem) {
  return (
    <div>
      {params.pic && params.description ? (
        <FilledMenuItemPic
          pic={params.pic}
          alt={params.description}
          seasonal={params.seasonal}
        />
      ) : (
        <BlankMenuItemPic />
      )}
    </div>
  );
}
