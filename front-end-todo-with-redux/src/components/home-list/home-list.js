// Imports
import styled from "styled-components";
import { useEffect, useState, useContext, useCallback } from "react";
import { ThemeTogglerButton } from "../themeToggleButton/themeToggleButton";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Images

import checkIcon from '../../assets/Icons/check_24px.svg';
import closeIcon from "../../assets/Icons/close_24px_grey.svg";
import { ThemeContext } from "../contexts/toggleButtonContext";


// Components
const Home = () => {

    // State Tasks
    const [tasks, setTasks] = useState({
        allTasks: [{ title: "Task1", completed: false }, { title: "Task2", completed: true }]
    })

    // Context Toggle
    const { theme } = useContext(ThemeContext);

    //fetchData
    const fetchTasks = useCallback(async () => {
        const response = await fetch(`http://localhost:4005/`)
        const data = await response.json()
        setTasks(() => ({
            allTasks: [...data]
        }));
    },[])

    const createTaskPayload = (inputTask) => JSON.stringify(inputTask);

    //addData - receber os parâmetros do input (TITLE E COMPLETED);
    const postTask = useCallback(async (inputTask) => {
        const payload = createTaskPayload(inputTask);

        try {
            const response = await fetch('http://localhost:4005/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
            })
            const data = await response.json();
            fetchTasks();
            console.log(data);
            if (!response.ok) {
                throw new Error('Erro ao adicionar tarefa');
            }
        } catch (error) {
            console.error('ERRO:', error);
        }
    },[fetchTasks]);

    const updateTask = useCallback(async (id, checkedStatus) => {
        const payload = createTaskPayload({"completed":!checkedStatus});

        try {
            const response = await fetch(`http://localhost:4005/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
            })
            const data = await response.json();
            fetchTasks();
            console.log(data);
            if (!response.ok) {
                throw new Error('Erro ao adicionar tarefa');
            }
        } catch (error) {
            console.error('ERRO:', error);
        }
    },[fetchTasks]);

    const deleteTask = async(id) => {
        try{
            const response = await fetch(`http://localhost:4005/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })
            const data = await response.json();
            fetchTasks();
           
            if (!response.ok) {
                throw new Error('Erro ao adicionar tarefa');
            }
        }
        catch(err){}
    }

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks])

    return (
        <Container theme={theme} className="container">
            <HomeStyled>
                <div className="list-header">
                    <h1 className="list-title">TODO</h1>
                    <ThemeTogglerButton />
                </div>
                <ListedNotes deleteTask={deleteTask} updateTask={updateTask} theme={theme} tasks={tasks} setTasks={setTasks} postTask={postTask} />
            </HomeStyled>

        </Container>
    )
}

const ListedNotes = ({ theme, tasks, setTasks, postTask, updateTask, deleteTask }) => {

    //State Input
    const [inputTask, setInputTask] = useState({
        title: String,
        completed: Boolean,
    });

    // State Filter's
    const [menuFilter, setMenuFilter] = useState({
        allTasks: [],
        active: [],
        completed: [],
        selected: 2,

    })

    const handleInputTask = (event) => {
        const { target } = event;
        const { value } = target;

        setInputTask({
            title: value,
            completed: inputTask.completed
        })
    }

    const handleInputChecked = (e) => {
        setInputTask((prevState) => ({
            ...prevState,
            completed: !inputTask.completed
        }))
    }

    const handleSubmit = (e) => {
        const { key } = e;
        if (key === "Enter") {
            postTask(inputTask);
            setInputTask({
                title: String,
                completed: Boolean
            });

        }
    }

    const handleUpdateChecked = (id, checkedStatus) => {
        // Task a ser atualizada
        const requestId = parseInt(id) + 1;
        console.log(`handleUpdateChecked - ID: ${requestId}, checkedStatus ${checkedStatus}`);
        updateTask(requestId, checkedStatus);
    }

    const handleDeleteTask = (id) => {
        console.log(id);
        deleteTask(id);
    }

    const reorderTasks = (tasks, startIndex, endIndex) => {
        const newTasks = [...tasks];
        const [reorderedTask] = newTasks.splice(startIndex, 1);
        newTasks.splice(endIndex, 0, reorderedTask);
        return newTasks;
    }

    const handleDragEnd = useCallback((result) => {
        if (!result.destination) return;
        setTasks((prevState) => ({
            ...prevState,
            allTasks: reorderTasks(prevState.allTasks, result.source.index, result.destination.index)
        }));
    }, [setTasks]);

    return (
        <ListedNotesStyled theme={theme}>
            <div className="note list-input">
                <input className="note-checked" type="checkbox" checked={inputTask.completed}></input>
                <label htmlFor="note-checked" className="note-checked-label" onClick={handleInputChecked}></label>
                <input className="input-note" type="text" placeholder="Create a new todo..." onKeyDown={handleSubmit} onChange={handleInputTask} />
            </div>
            <br />

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasksList">
                    {(provided) => (
                        <div className="note list-notes" ref={provided.innerRef} {...provided.droppableProps}>
                            {tasks.allTasks.length > 0 ? (
                                tasks.allTasks.map((task, index) => (
                                    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="posted-note"
                                            >
                                                <input type="checkbox" id={index} className="note-checked" checked={task.completed} />
                                                <label htmlFor="note-checked" className="note-checked-label" onClick={() => handleUpdateChecked(index, task.completed)}></label>
                                                <p className={`content ${task.completed ? 'done' : ''}`}>{task.title}</p>
                                                <img onClick={() => handleDeleteTask(task.id)} src={closeIcon} alt="Delete task" className="delete-task"/>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            )
                                : ('No tasks')}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <div className="actions-and-info">
                <p className="items-left">{tasks.allTasks.length} items left</p>
                <div className="filters">
                    <p className={`state-all ${menuFilter.selected === 1 ? 'active' : ''}`}>All</p>
                    <p className={`state-active ${menuFilter.selected === 2 ? 'active' : ''}`}>Active</p>
                    <p className={`state-completed ${menuFilter.selected === 3 ? 'active' : ''}`}>Completed</p>
                </div>
                <p className="clear-completed">Clear Completed</p>
            </div>
        </ListedNotesStyled >
    )
}

const Container = styled.div`
    display:grid;
    place-items:center;
    width:100vw;
    height:100vh;
    
    //Background-Image

    background-image:url(${(props) => props.theme.image_header});
    background-size:100% 35%;
    background-repeat:no-repeat;
    background-color:${(props) => props.theme.background};
`

const HomeStyled = styled.div`
    font-family:'Ubuntu Regular';
    max-width:500px;
    width:100%;
     
    .list-header {
        display: flex;
        width: 100%;
        justify-content:space-between;
        align-items:center;
    }

    .list-title {
        color:white;
        letter-spacing:10px;
    }

`

const ListedNotesStyled = styled.div`
    width:100%;
    font-family:'Ubuntu Regular';
    

    .list-input {
        display:flex;
        height:60px;
        align-items:center;
        border-radius: 5px;
    }

    .list-input .input-note {
        color:${(props) => props.theme.color};
        width:80%;
        background-color:${(props) => props.theme.list_color};
        border:0;
        margin:0;
        outline: none;
    }

    .input-note::placeholder, .input-note, .posted-note {
        font-size:18px;
        color:${(props) => props.theme.color};
        
    }

    .list-notes {
        display:flex;
        flex-direction:column;
    }

    .note {
        border-radius: 5px;
        background-color:${(props) => props.theme.list_color};
        box-shadow: ${(props) => props.theme.box_shadow};
    }

    .posted-note {
        display:grid;
        grid-template-columns: 15% 75% 1fr;
        min-height:60px;
        align-items:center;
        justify-items:center;
        border-bottom:1px solid;
        border-color:${(props) => props.theme.border_color};
        cursor:pointer;
        width:100%;
    }

    .note-checked {
        display:none;
        border:1px solid black;
    }

    .note-checked-label {
        color:#4e505b;
        display:inline-block;
        width:25px;
        height:25px;
        margin:0 10px;
        border:1px solid;
        border-radius:50%;
        cursor:pointer;
    }

    .note-checked-label:hover {
        background:linear-gradient(to top, #4632B5, purple);
        -webkit-mask:linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0) content-box;
        -webkit-mask-composite:xor;
        mask-composite:exclude;
        mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0) content-box;
    }

    .note-checked:checked + .note-checked-label {
        background-repeat:no-repeat;
        background-size:20px 20px;
        background-position: center;
        background:linear-gradient(to top, #4632B5, purple);
        background-image:url(${checkIcon}), linear-gradient(to top, #4632B5, purple);
    }

    .content {
        margin:0;
        width:100%;
        overflow-wrap: break-word;
    }

    .content.done {
        text-decoration:line-through;
    }

    .delete-task{
        width:24px;
        height:24px;
    }

    .actions-and-info {
        display:flex;
        justify-content:space-between;
        align-items:center;
        font-size:14px;
        color:${(props) => props.theme.bottom_filter};
        background-color:${(props) => props.theme.list_color};
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        box-shadow:${(props) => props.theme.box_shadow};
    }

    .actions-and-info p {
        margin:10px;
    }

    .actions-and-info p:not(.items-left){
        cursor:pointer;
    }

    .actions-and-info p:not(.items-left, .clear-completed) {
        font-family:'Ubuntu Bold';
    }

    .actions-and-info p:not(.items-left, .clear-completed):hover {
        color:${(props) => props.theme.bottom_hover};
    }

    .clear-completed:hover {
        color:${(props) => props.theme.bottom_hover};
    }

    .filters {
        display:flex;
    }

    .state-all.active, .state-active.active, .state-completed.active {
        color:#78a0f8;
    }
`


export default Home

// Não-concluido
// Wrap task quando exceder o tamanho designado pelo grid; LINHA 200 a 210;
// Estilizar botão delete
// Filter actions - WIP
// Responsividade mobile

// Excluir task - OK
// States react - OK
// Toggle Button - OK
// checkedIcon para a checkbox - OK
// Font BOLD para barra de filtragem - OK
// Riscar a tarefa quando o checkbox estiver selecionado - OK
// Função dos botoes checked (Atualizar banco de dados) - OK
