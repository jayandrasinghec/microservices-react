
export const moveNode = (
    node: any,
    sourceNode: any,
    destinationNodeId: string
  ): boolean => {
    if (node.id === destinationNodeId) {
      if (!node.children) node.children = [];
      const order =
        node.children && node.children.length > 0
          ? node.children[node.children.length - 1].order || 0
          : 0;
      sourceNode.order = order + 1;
      node.children.push(sourceNode);
      return true;
    }
  
    if (node.children) {
      for (let index = 0; index < node.children.length; index++) {
        const isMoved = moveNode(node.children[index], sourceNode, destinationNodeId);
        if (isMoved) return true;
      }
    }
  
    return false;
  };

  export const deleteNode = (node: any, sourceNodeId: string, parentNodeId: string): boolean => {
    if (node.id === parentNodeId) {
      node.children = node.children?.filter((x:any) => x.id !== sourceNodeId);
      return true;
    }
  
    if (node.children) {
      for (let index = 0; index < node.children.length; index++) {
        const isDeleted = deleteNode(node.children[index], sourceNodeId, parentNodeId);
        if (isDeleted) return true;
      }
    }
  
    return false;
  };

  export const search = (items:any, value:any) => {
    return items.reduce((acc: any, item:any) => {
       
      if (contains(item.name, value)) {
        acc.push(item);
      } else if (item.children && item.children.length > 0) {
        let newItems = search(item.children, value);
        if (newItems && newItems.length > 0) {
          acc.push({
            id : item.id,
            name: item.name,
            children: newItems,
          });
        }
      }
      return acc;
    }, []);
  };


const contains = (name:any, term:any) => {
  return name.toLowerCase().indexOf(term.toLowerCase()) >= 0;
};

  
export const getContent = (data : any, id : any) => {
    if(data.id === id)
    {
      return data;
    }
    if(data.children){
      for(let child of data.children){
      const childObj : any = getContent(child, id)
      if(childObj) return childObj
      }
    }
         
  };

  export const deleteRow = (node: any,id:any)=>{
    return node.some((o : any, i : any, a : any) => o.id === id
    ? a.splice(i, 1)
    : deleteRow(o.children || [], id)
    );
    };

    export const addNode = (node: any, childNode: any, parentNodeId: string): boolean => {
      if (node.id === parentNodeId) {
        if (!node.children) node.children = [];
        const order =
          node.children && node.children.length > 0
            ? node.children[node.children.length - 1].order || 0
            : 0;
            childNode.order = order + 1;
        node.children.push(childNode);
        return true;
      }
    
      if (node.children) {
        for (let index = 0; index < node.children.length; index++) {
          const isMoved = addNode(node.children[index], childNode, parentNodeId);
          if (isMoved) return true;
        }
      }
    
      return false;
    };

