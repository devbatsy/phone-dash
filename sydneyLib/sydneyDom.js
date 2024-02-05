class addStyleComponent{
    constructor(style)
    {
        this.defaultStyle = style;
        this.merge = (useObj) =>{
            let string = new String();
            for(let [x,y] of Object.entries(useObj))
            {
                let styleEntity = `${x}: ${y}; `
                string += styleEntity;
            }
            return string;
        }
        this.mergedStyle = this.merge(this.defaultStyle);

        this.update = (cmd = {}) =>{
            let returnable;
            let newStyle = new Object;
            Object.assign(newStyle,this.defaultStyle);
            
            const operation = (obj = {}) =>{
                let {method,style} = obj;
                switch(true)
                {
                    case method === 'remove':
                        style = style === undefined ? [] : style;
                        for(let x of style)
                        {
                            if(x in newStyle)
                            {
                                delete newStyle[x];
                            }
                        }
                        returnable = this.merge(newStyle);
                    break;
                    case method === 'add':
                        style = style === undefined ? {} : style;
                        for(let [y,z = ''] of Object.entries(style))
                        {
                            newStyle[y] = z;
                        }
                        returnable = this.merge(newStyle);
                    break;
                    default:
                        returnable = this.mergedStyle;
                }
            }

            try{
                cmd.forEach(val =>{
                    operation(val)
                })
            }
            catch(err)
            {
                operation(cmd)
            }
            return returnable;
        }
    }
}
export const sydDOM = new Object();
export const virtualDom = new Object();
export const DomType = new Object();
export const styleComponent = new Object();
export const setStyle = (styleArray = []) =>{
    let returnable = []
    const run = ({nameTag,style = {}}) =>{
        if(nameTag === undefined)
        {
            console.error("please enter a style name for reference")
        }else{
            styleComponent[nameTag] = new addStyleComponent(style).update;
            returnable.push(styleComponent[nameTag]());
        }
    }
    switch(true)
    {
        case styleArray.length !== undefined:
            // styleArray.style = styleArray.style === undefined ? {} : styleArray.style;
            for(let elem of styleArray)
            {
                run(elem)
            }
        break;
        default:
            styleArray.style = styleArray.style === undefined ? {} : styleArray.style;
            run(styleArray)
    }
   return returnable.length === 1 ? returnable[0] : returnable;
}

// STATES SECTION

class createState{
    constructor(name,props)
    {
        this.object = new Object();
        this.object.stateName = name;
        this.object.count = 0;
        for(const [prop,value] of Object.entries(props))
            {
                this.object[prop] = value;
            }
    }
}

const GlobalState = new Object();

export const addState = (name,props = {}) =>{
    switch(true)
    {
        case name !== undefined:
            GlobalState[name] = new createState(name,props).object;
        break;
        default: console.error('Enter a name for the addState')
    }
}

export const useState = (name,version) =>{
    version = version === undefined ? "old" : "new";
    switch(true)
    {
        case GlobalState[name][version] !== undefined:
            return GlobalState[name][version];
        break;
        default:
            console.error('State Does Not Exist');
    }
}

//RENDER SECTION

class creator{
    constructor({tagname,attribute,children,Dom,createState})
    {
        this.element = document.createElement(tagname);
        switch(true)
        {
            case Dom !== null:  
                virtualDom[Dom] = this.element;
                DomType[Dom] = Dom;
        }
        this.addStateDom = () =>{
            if(Object.keys(createState).length > 0)
            {
                const name = createState.stateName;
                addState(
                    name,
                    createState.state
                )
            }
        }
        this.addStateDom()
        Object.keys(attribute).forEach((val,id,array)=>{
            this.element.setAttribute(val,attribute[val])
        })
        children.forEach(val =>{
           const child = render(val);
           this.element.appendChild(child);
        })
    }
}
export const render = (vapp) =>{
    if(typeof vapp === 'string') 
    {
        return document.createTextNode(vapp)
    }else return new creator(vapp).element
}

//MOUNT SECTION

export const mount = (VDom) =>{
    const Dom = render(VDom);
    document.querySelector('.panel').replaceWith(Dom);
    return Dom
}


// DIFFING ALGORITHM

class diffAlgo{
    constructor(type,oldVApp,newVApp)
    {
        this.oldVApp = oldVApp;
        this.newVApp = newVApp;
        this.$dom = virtualDom[type];
        this.Ndom = [];
        this.patches = new Array();
        diffAlgo.startDiffing(this)
    }
    static startDiffing(params)
    {
        const {oldVApp,newVApp,$dom} = params;
        let {patches} = params;

        const startTagComparison = (oldVApp,newVApp) =>{
            switch(true)
            {
                case oldVApp.tagname === newVApp.tagname:
                    return true;
                break;
                default:
                    return false;
            }
        }


        const updateAttr = (oldVAppAttr,newVAppAttr,parent) =>{
            for(let [x,y] of Object.entries(newVAppAttr))
            {
                switch(true)
                {
                    case !(x in oldVAppAttr) || y !== oldVAppAttr[x]:
                        patches.push(
                            [parent,parent =>{
                                parent.setAttribute(x,y)
                            }]
                        )
                    break;
                }
            }

            for(let [x,y] of Object.entries(oldVAppAttr))
            {
                if(!(x in newVAppAttr))
                {
                    patches.push(
                        [parent,parent =>{
                            parent.removeAttribute(x);
                        }]
                    )
                }
            }
        }

        const zip = (Ochildren,Nchildren) =>{
            const zipped = new Array();
            for(let i = 0; i < Math.min(Ochildren.length,Nchildren.length); i++){
                zipped.push([Ochildren[i],Nchildren[i]])
            }
            return zipped
        }

        const updateChild = (Ochildren,Nchildren,parent) =>{
            const arrays = zip(Ochildren,Nchildren);
            arrays.forEach((val,idx) =>{
                if(val.length > 0)
                {
                    startchildProcess(val[0],val[1],parent.childNodes[idx])
                }
            });

            for(let i = 0; i < Nchildren.length; i++)
            {
                switch(true)
                {
                    case i > arrays.length-1:
                        patches.push(
                            [parent,parent =>{
                                parent.appendChild(render(Nchildren[i]));
                            }]
                        ) 
                }
            }
            const dummy = [];

            for(let i = 0; i < Ochildren.length; i++)
            {
                switch(true)
                {
                    case i > arrays.length-1:
                        dummy.push(i)
                }
            }
            for(let i = dummy.length-1; i >= 0;i--)
            {
                patches.push(
                    [parent,parent =>{
                        parent.removeChild(parent.childNodes[dummy[i]]);
                    }]
                ) 
            }
        }

        const stringProcess = (parent,newVApp) =>{
            patches.push(
                [parent,parent =>{
                    parent.replaceWith(render(newVApp));
                }]
            )
        }

        const startchildProcess = (oldVApp,newVApp,parent) =>{
            switch(true)
            {
                case typeof newVApp === 'string':
                    switch(true)
                    {
                        case newVApp !== oldVApp:
                            stringProcess(parent,newVApp);
                    }
                break;
                default:
                    const boolean = startTagComparison(oldVApp,newVApp);
                    switch(true)
                    {
                        case boolean:
                            updateAttr(oldVApp.attribute,newVApp.attribute,parent);
                            updateChild(oldVApp.children,newVApp.children,parent);
                        break;
                        default:
                            patches.push(
                                [parent,parent =>{
                                    parent.replaceWith(render(newVApp));
                                }]
                            ) 
                    }
            }
        }
        startchildProcess(oldVApp,newVApp,$dom);
        patches.forEach(val => val[1](val[0]));
    }
}

export const sydDiff = ({type, oldVApp, newVApp}) =>{
    return new diffAlgo(type,oldVApp,newVApp).patches;
}
// export default diffAlgo;

//CREATE ELEMENT SECTION

class createElementClass{
    constructor(tagname,attribute,children,type,createState)
    {
        this.mainObj = new Object;
        this.mainObj.tagname = tagname;
        this.mainObj.attribute = attribute;
        this.mainObj.children = children;
        this.mainObj.Dom = type;
        this.mainObj.createState = createState
        this.mainObj.removeAttr = (attrArray) =>{
            for(let attrName of attrArray)
            {
                if(attrName in this.mainObj.attribute)
                {
                    delete this.mainObj.attribute[attrName];
                }
            }
            return this.mainObj;
        }

        this.mainObj.addAttr = (objectAttr = {}) =>{
            Object.entries(objectAttr).forEach(val =>{
                let [x,y] = val;
                y = y === null ? "" : y;
                this.mainObj.attribute[x] = y;
            })
            return this.mainObj;
        }
    }
}

export const createElement = (tagname = {}, attribute = {}, children = [],{type = null,createState = {}} = {}) =>{
   return new createElementClass(tagname,attribute,children,type,createState).mainObj
}