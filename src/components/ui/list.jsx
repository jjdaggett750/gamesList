export function List({ children }) {
    return <ul className="space-y-2">{children}</ul>;
  }
  
  export function ListItem({ children }) {
    return <li className="bg-gray-100 p-3 rounded-md">{children}</li>;
  }
  