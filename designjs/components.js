import { 
	DomType,
	sydDOM,
	setStyle,
	styleComponent,
	mount,
	addState,
	createElement,
} from "../sydneyLib/sydneyDom.js";
import { initCanvas } from "../jsFiles/main.js";

setStyle([
    {
        nameTag:'default',
        style:{
            'margin':'0',
            'padding':'0',
            'box-sizing':'border-box'
        }
    },
    {
        nameTag:'flextype',
        style:{
            'display':'flex',
            'justify-content':'center',
            'align-items':'center',
            'row-gap':'10px',
            'column-gap':'20px'
        }
    },
    {
        nameTag:'centerBg',
        style:{
            'background-position':'center',
            'background-size':'contain',
            'background-repeat':'no-repeat'
        }
    },
    {
        nameTag:'float',
        style:{
            position:'absolute',
            top:'50%',
            left:'50%',
            transform:'translateX(-50%) translateY(-50%)'
        }
    },
    {
        nameTag:'font',
        style:{
            'text-align':'center',
            'font-size':'40px',
            'font-family':'high Tower text',
            'font-weight':'500',
            'color':'aqua'
        }
    }
])

setStyle(
    {
        nameTag:'panel',
        style:{
            height:'100vh',
            width:'100vw',
            'background':'aqua',
            'position':'relative'
        }
    }
)
setStyle(
    {
        nameTag:'enterButton',
        style:{
            'height':'30px',
            'width':'30px',
            'padding':'10px',
            'cursor':'pointer',
        }
    }
)
setStyle(
    {
        nameTag:'playSection',
        style:{
            height:'90%',
            width:'90%',
            'max-width':'600px',
            'max-height':'400px',
            'overflow-y':'scroll',
            'background':'rgba(0,0,0,.5)',
            'z-index':'100',
            padding:'5px'
        }
    }
)

setStyle(
    {
        nameTag:"settings",
        style:{
            padding:'10px'
        }
    }
)
setStyle(
    {
        nameTag:'tab',
        style:{
            'min-height':'40px',
            width:'40px',
            cursor:'pointer'
        }
    }
)

setStyle(
    {
        nameTag:'playerLife',
        style:{
            padding:'10px',
        }
    }
)

setStyle(
    [
        {
            nameTag:'table',
            style:{
                height:'100%',
                width:'100%',
                border:'2px solid #171717',
                'border-collapse':'collapse'
            }
        },
        {
            nameTag:'tr',
            style:{
                padding:'5px',
                height:'fit-content',
                width:'fit-content',
                background:'rgba(0,0,0,.5)'
            }
        },
        {
            nameTag:'tCommon',
            style:{
                border:'1px solid #171717',
                padding:'5px',
                'text-transform':'capitaliZe'
            }
        },
        {
            nameTag:'rank',
            style:{
                'width':'0',
                'padding':'10px',
                'text-align':'center'
            }
        }
    ]
)

setStyle(
    [
        {
            nameTag:'input',
            style:{
                'min-height':'40px',
                'width':'80%',
                'max-width':'300px',
                'padding':'5px',
                'padding-left':'10px',
                'outline':'none',
                'border':'none'
            }
        },
        {
            nameTag:'inputFont',
            style:{
                'font-family':'high tower text',
                'text-transform':'capitalize',
                'font-size':'20px'
            }
        },
        {
            nameTag:'button',
            style:{
                'border':'none',
                'background-color':'unset'
            }
        }
    ]
)

sydDOM.panel = () =>{
    return createElement(
        'div',
        {style:styleComponent.default()+styleComponent.flextype()+styleComponent.panel(),ondblclick:'screen()'},
        [
            sydDOM.enter(),
            sydDOM.playSection(),
            sydDOM.mainLeader(),
            sydDOM.canvas(),
            sydDOM.pause(),
            sydDOM.playerLife(),
            sydDOM.score(),
            sydDOM.bitCoins()
        ]
    )
}

sydDOM.enter = (display = 'flex') =>{
    return createElement(
        'div',
        {
            style:styleComponent.panel({method:'add',style:{
            background:'#000',
            'z-index':'200'
            }})+styleComponent.flextype({method:'add',style:{
                display:display
            }})+styleComponent.float()
        },
        [
            sydDOM.miniPage()
        ],
        {type:'enterPage'}
    )
}

sydDOM.miniPage = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.settings({method:'add',style:{background:'#333'}})+styleComponent.flextype({
                method:'add',
                style:{
                    'flex-wrap':'wrap',
                    'row-gap':'30px',
                    padding:'20px'
                }
            })
        },
        [
            sydDOM.input(),
            sydDOM.enterButton(),
            sydDOM.loading()
        ]
    )
}

sydDOM.loading = (percent = 0) =>{
    return createElement(
        'div',
        {style:styleComponent.input({method:'add',style:{
            background:'rgba(0,0,0,.5)',
            'min-height':'3px',
            'position':'relative'
        }})},
        [
            createElement(
                'div',
                {style:`position:absolute;top:0;left:0;background:goldenrod;height:100%;width:${percent}%`}
            )
        ],{type:'loading'}
    )
}

sydDOM.enterButton = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.enterButton()+styleComponent.centerBg({method:'add',style:{'background-image':'url(../images/ent.png)'}}),
            onclick:'enterGame()'
        },
        []
    )
}

sydDOM.playSection = (display = 'flex') =>{
    return createElement(
        'div',
        {
            style:styleComponent.playSection()+styleComponent.float(
                {method:'add',style:{
                    transform:'translateX(-50%)',
                    top:'30px'
                }}
            )+styleComponent.flextype({
                method:'add',
                style:{
                    'flex-direction':'column',
                    'justify-content':'flex-start',
                    'row-gap':'5px',
                    poaition:'relative',
                    display:display
                }
            })
        },
        [
            sydDOM.title(),
            sydDOM.tips('-> double tap screen to switch between full screen mode'),
            sydDOM.tips('-> click on the achievement section to view top 10 players'),
            sydDOM.tips('-> speed will progressively increase as playtime increase'),
            sydDOM.settings(),
            sydDOM.maxScore(),
            sydDOM.rank(),
                createElement(
                    'form',
                    {method:'post', action:'/saveScore',style:styleComponent.flextype()},
                    [
                        sydDOM.holdUserName(),
                        sydDOM.holdScore(),
                        sydDOM.tips('Submit Score'),
                        sydDOM.submitButton(),
                    ]
                ),
                sydDOM.mute()
        ],
        {type:'playSection'}
    )
}

sydDOM.tips = (text) =>{
    return createElement(
        'p',
        {style:styleComponent.font(
            {
                method:'add',
                style:{
                    'font-size':'14px',
                    'color':'aqua',
                    'font-weight':'900',
                    'text-transform':'capitalize',
                    'padding':'5px',
                    'background':'#333'
                }
            }
        )},
        [
            text
        ]
    )
}


sydDOM.mute = (opacity = '1') =>{
    return createElement(
        'span',
        {style:styleComponent.centerBg({method:'add',style:{height:'40px',width:'40px','background-image':'url(../images/sound.png)'}})+styleComponent.float(
            [
                {method:'remove',style:['transform','left']},
                {method:'add',style:{top:'10px',left:'10px','column-gap':'5px','cursor':'pointer',opacity:opacity}}
            ]
            ),
            onclick:'mute()'
        },
        [],
        {type:'mute'}
    )
}

sydDOM.holdUserName = (value = '') =>{
    return createElement(
        'input',
        {style:'display:none', value:value,name:'username'},
        [],
        {type:'holdUserName'}
    )
}

sydDOM.title = () =>{
    return createElement(
        'h1',
        {style:styleComponent.font(
            {
                method:'add',
                style:{
                    'font-size':'25px',
                    'text-transform':'capitalize',
                    'font-weight':'900'
                }
            }
        )},
        [
            "Phone Dash"
        ]
    )
}

sydDOM.settings = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.settings()+styleComponent.flextype({
                method:'add',
                style:{
                    'flex-wrap':'wrap'
                }
            })
        },
        [
            sydDOM.play(),
            sydDOM.leaderBoard(),
        ]
    )
}

sydDOM.maxScore = (score = 0) =>{
    return createElement(
        'h2',
        {style:styleComponent.font(
            {
                method:'add',
                style:{
                    'font-size':'20px',
                    'text-transform':'capitalize',
                    'font-family':'monospace',
                    'font-weight':'300'
                }
            }
        )},
        [ `max score : ${score}.00M`],
        {type:'maxScore'}
    )
}

sydDOM.rank = (rank = 0) =>{
    return createElement(
        'h2',
        {style:styleComponent.font(
            {
                method:'add',
                style:{
                    'font-size':'20px',
                    'text-transform':'capitalize',
                    'font-family':'monospace',
                    'font-weight':'300'
                }
            }
        )},
        [ `rank : ${rank}`],
        {type:'rank'}
    )
}

sydDOM.play = () =>{
    return createElement(
        'span',
        {
            style:styleComponent.tab()+styleComponent.centerBg({method:'add',style:{'background-image':'url(../images/startBtn.png)'}}),
            onclick:'startGame()'
        }
    )
}
sydDOM.leaderBoard = () =>{
    return createElement(
        'span',
        {style:styleComponent.tab()+styleComponent.centerBg({method:'add',style:{'background-image':'url(../images/leaderBoard.png)'}}),onclick:'togBoard()'}
    )
}

sydDOM.submit = () =>{
    return createElement(
        'span',
        {style:styleComponent.tab()+styleComponent.centerBg({method:'add',style:{'background-image':'url(../images/msg.png)'}}),onclick:'togFile()'}
    )
}

sydDOM.mainLeader = (display = 'none') =>{
    return createElement(
        'div',
        {
            style:styleComponent.playSection()+styleComponent.float(
                {method:'add',style:{
                    transform:'translateX(-50%)',
                    top:'30px'
                }}
            )+styleComponent.flextype({
                method:'add',
                style:{
                    'flex-direction':'column',
                    'justify-content':'flex-start',
                    'row-gap':'30px',
                    display:display
                }
            })
        },
        [
            sydDOM.exitMainLeader(),
            sydDOM.leaderHeader(),
            sydDOM.leaderTable()
        ],
        {type:'mainLeader'}
    )
}

sydDOM.input = () =>{
    return createElement(
        'input',
        {
            style:styleComponent.input()+styleComponent.inputFont(),
            name:'name',
            placeholder:'enter your username',
            oninput:'editUserName()'
        },[],{type:'username'}
    )
}

sydDOM.holdScore = (value = '') =>{
    return createElement(
        'input',
        {
            style:styleComponent.input({method:'add',style:{'display':'none'}})+styleComponent.inputFont(),
            name:'score',
            'readOnly':'readOnly',
            value:value
        },[],{type:'holdScore'}
    )
}

sydDOM.submitButton = () =>{
    return createElement(
        'button',
        {style:styleComponent.tab()+styleComponent.centerBg({method:'add',style:{'background-image':'url(../images/submit.png)'}})+styleComponent.button(),type:'submit'}
    )
}

sydDOM.fileName = () =>{
    return createElement(
        'h2',
        {style:styleComponent.font(
            {
                method:'add',
                style:{
                    'font-size':'20px',
                    'text-transform':'capitalize',
                    'text-decoration':'underline'
                }
            }
        )},
        ['submit score']
    )
}

sydDOM.leaderHeader = () =>{
    return createElement(
        'h2',
        {style:styleComponent.font(
            {
                method:'add',
                style:{
                    'font-size':'20px',
                    'text-transform':'capitalize',
                    'text-decoration':'underline'
                }
            }
        )},
        ['leader board']
    )
}

sydDOM.leaderTable = (obj = []) =>{
    const arrayElem = new Array();
    const createRow = (name,score,id) =>{
        const dataelem = [];
        let childEase = [name,score]
        let childTemplate = id === undefined ? 'th' : 'td'
        for(let i = 0; i < 3; i++)
        {
            if(i === 0 && id !== undefined)
            {
                dataelem.push(
                    createElement(
                        childTemplate,
                        {style:styleComponent.tCommon()+styleComponent.font({method:'add',style:{'text-align':'left','font-size':'20px',color:'#fff'}})+styleComponent.rank()},
                        [`${id}`]
                    )
                )
            }else if(i === 0 && id === undefined)
            {
                dataelem.push(
                    createElement(
                        childTemplate,
                        {style:styleComponent.tCommon()+styleComponent.font({method:'add',style:{'text-align':'left','font-size':'17px',color:'#fff'}})+styleComponent.rank()},
                        ['rank']
                    )
                )
            }
            else if(i > 0 && i < 2)
            {
                dataelem.push(
                    createElement(
                        childTemplate,
                        {style:styleComponent.tCommon()+styleComponent.font({method:'add',style:{'text-align':'left','font-size':'17px',color:'#fff'}})},
                        [`${childEase[i-1]}`]
                    )
                )
            }else if(i === 2)
            {
                dataelem.push(
                    createElement(
                        childTemplate,
                        {style:styleComponent.tCommon()+styleComponent.font({method:'add',style:{'text-align':'left','font-size':'17px',color:'#fff'}})+styleComponent.rank()},
                        [`${childEase[i-1]}`]
                    )
                )
            }
        }
        arrayElem.push(
            createElement(
                'tr',
                {
                    style:styleComponent.tr()
                },
                [
                    ...dataelem
                ]
            )
        )
    }   
    for(let i = 0; i < Object.keys(obj).length+1;i++)
    {
        if(i === 0)
        {
            createRow('usernames','scores')
        }else{
            createRow(obj[i-1].username,obj[i-1].maxScore,i)
        }
    }
    return createElement(
        'table',
        {
            style:styleComponent.table()
        },
        [
            ...arrayElem
        ],
        {type:'leaderTable'}
    )
}

sydDOM.exitMainLeader = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.float(
            [
                {method:'remove',style:['transform','left']},
                {method:'add',style:{top:'10px',right:'10px',height:'30px',width:'30px',cursor:'pointer'}}
            ]
            )+styleComponent.centerBg({method:'add',style:{'background-image':'url(../images/exit.png)'}}),
            onclick:'togBoard()'
    },
    [],
    {type:'exitMainLeader'}
    )
}

sydDOM.canvas = () =>{
    return createElement(
        'canvas',
        {id:'mainCanvas',style:'background-color:aqua;image-rendering: pixelated;'}
    )
}

sydDOM.pause = (display = 'none') =>{
    return createElement(
        'div',
        {
            style:styleComponent.float(
            [
                {method:'remove',style:['transform','left']},
                {method:'add',style:{top:'10px',right:'10px',height:'30px',width:'30px',cursor:'pointer',display:display}}
            ]
            )+styleComponent.centerBg({method:'add',style:{'background-image':'url(../images/pause.png)'}}),
            onclick:'togPlaySec()'
    },
    [],
    {type:'pause'}
    )
}

sydDOM.playerLife = (lives = 2) =>{
    lives = lives < 0 ? 0 : lives;
    const elem = new Array();
    for(let i = 0; i < lives; i++)
    {
        elem.push(
            createElement(
                'img',
                {style:'height:25px;width:25px;',src:'../images/assets/heart.png'},
            )
        )
    }
    return createElement(
        'div',
        {style:styleComponent.playerLife()+styleComponent.flextype({method:'remove',style:['justify-content']})+styleComponent.float(
            [
                {method:'remove',style:['transform','left']},
                {method:'add',style:{top:'10px',left:'10px','column-gap':'5px'}}
            ]
            )},
        [
            sydDOM.playerIcon(),
            ...elem
        ],
        {type:'playerLife'}
    )
}

sydDOM.playerIcon = () =>{
    return createElement(
        'div',
        {style:styleComponent.centerBg({method:'add',style:{height:'40px',width:'40px','background-image':'url(../images/assets/phone.png)'}})}
    )
}

sydDOM.score = (score = 0) =>{
    return createElement(
        'div',
        {style:styleComponent.float(
            [
                {method:'remove',style:['transform','left']},
                {method:'add',style:{top:'50px',right:'10px'}}
            ]
            )+styleComponent.font({method:'add',style:{color:'#171717','font-size':'14px','text-transform':'capitalize','font-family':'monospace','font-weight':'300'}})},
        [`score : ${score}.00M`],
        {type:'score'}
    )
}

sydDOM.bitCoins = (coin = 0) =>{
    return createElement(
        'div',
        {style:styleComponent.float(
            [
                {method:'remove',style:['transform','left']},
                {method:'add',style:{top:'80px',right:'10px'}}
            ]
            )+styleComponent.font({method:'add',style:{color:'#171717','font-size':'14px','text-transform':'capitalize','font-family':'monospace','font-weight':'300'}})},
        [`Ethereum : ETH ${coin}.00`],
        {type:'bitCoins'}
    )
}

addEventListener('load', e =>{
    mount(sydDOM.panel())

    canvas = document.querySelector('#mainCanvas');

    initCanvas()
    addState(
        DomType.enterPage,
        {
            new:'none',
            old:'flex'
        }
    )
    
    addState(
        DomType.playSection,
        {
            old:{d:'flex'},
            new:{d:'none'}
        }
    )
    
    addState(
        DomType.pause,
        {
            old:{d:'none'},
            new:{d:'block'}
        }
    )

    addState(
        DomType.mainLeader,
        {
            old:{d:'none'},
            new:{d:'flex'}
        }
    )

    addState(
        DomType.playerLife,
        {
            old:{live:2},
            new:{live:2}
        }
    )

    addState(
        DomType.maxScore,
        {
            old:{num:0},
            new:{num:0}
        }
    )

    addState(
        DomType.holdUserName,
        {
            old:{value:''},
            new:{value:''},
        }
    )

    addState(
        DomType.mute,
        {
            old:{opacity:'.4'},
            new:{opacity:'1'}
        }
    )

    addState(
        DomType.loading,
        {
            old:{width:0},
            new:{width:2}
        }
    )
})