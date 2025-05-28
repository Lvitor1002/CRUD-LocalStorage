const btnIncluir = document.getElementById("btnIncluir")
const campoJanela = document.getElementById("idFlex")
const formulario = document.getElementById("idFormulario")
const janelaExtra = document.querySelector(".janelaExtra")
const inputNome = document.getElementById("idNome")
const inputFuncao = document.getElementById("idFuncao")
const inputSalario = document.getElementById("idSalario")
const tabela = document.querySelector("tbody")
const btnFecharForm = document.getElementById("idBtnFecharForm")


let listaUsuarios, id 

const getItem = () => JSON.parse(localStorage.getItem('dbfun')) ?? [] 
const setItem = () => localStorage.setItem('dbfun',JSON.stringify(listaUsuarios))

renderizarTabela()

formulario.addEventListener("submit",function(evento){
    
    evento.preventDefault()

    const idParaEditar = formulario.dataset.editarId ? parseInt(formulario.dataset.editarId,10) : null 

    let nome = inputNome.value.trim()
    let funcao = inputFuncao.value.trim()
    const salario = inputSalario.value.trim().replace(/,/g, '.')
    
    
    inputNome.style.border = ''
    inputFuncao.style.border = ''
    inputSalario.style.border = ''

    
    if(!nome || !/^[A-Za-z\s]+$/.test(nome) || nome.length > 50){
        inputNome.style.border = '1px solid red'
        falha("Nome inválido. Use apenas letras e até 50 caracteres.");
        return
    }

    if(!funcao || !/^[A-Za-z\s]+$/.test(funcao) || funcao.length > 50){
        inputFuncao.style.border = '1px solid red'
        falha("Função inválida. Use apenas letras e até 50 caracteres.");
        return
    }

    const salarioValido = /^-?\d+([.,]\d+)?$/.test(salario);
    const salarioNumerico = parseFloat(salario);

    if (!salario || !salarioValido || salarioNumerico <= 0){
        inputSalario.style.border = '1px solid red'
        falha("Salário inválido.");
        return
    }

    nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase()
    funcao = funcao.charAt(0).toUpperCase() + funcao.slice(1).toLowerCase()

    //Editar --------------------
    listaUsuarios = getItem()
    
    if(idParaEditar){

        const index = listaUsuarios.findIndex(u=>u.id === idParaEditar)
        
        if(index !== -1){

            listaUsuarios[index] = {
                ...listaUsuarios[index],
                nome: nome,
                funcao: funcao,
                salario: salario
            }

            setItem()
            
            sucesso("Usuário Atualizado!","Sucesso ao atualizar usuário.")
        }
    }else{

    //Adicionar  --------------------
        listaUsuarios.push({
            'id':Date.now(),
            'nome':nome, 
            'funcao':funcao,
            'salario':salario 
        })

        setItem()
    
        sucesso("Usuário Cadastrado.","Sucesso ao cadastrar usuário")
    }


    campoJanela.classList.add("ocultar")

    formulario.reset()

    delete formulario.dataset.editarId

    renderizarTabela()
})

btnIncluir.addEventListener("click",function(evento){

    id = undefined

    campoJanela.classList.remove("ocultar")

    listaUsuarios = getItem()
})

function renderizarTabela(){

    tabela.innerHTML = ""

    listaUsuarios = getItem()


    listaUsuarios.forEach((usuario) => {
    
        
        const tr = document.createElement("tr")
        
       
        
        const tdNome = document.createElement("td")
        const tdFuncao = document.createElement("td")
        const tdSalario = document.createElement("td")
        
        tdNome.textContent = usuario.nome
        tdFuncao.textContent = usuario.funcao
        tdSalario.textContent = usuario.salario
        
        
        const tdEditar = document.createElement("td")
        const btnEditar = document.createElement("button")
        btnEditar.classList.add("bi","bi-pencil-fill","edita")
        tdEditar.appendChild(btnEditar)
        
        
        const tdRemover = document.createElement("td")
        const btnRemover = document.createElement("button")
        btnRemover.classList.add("bi","bi-x-lg","remove")
        tdRemover.appendChild(btnRemover)

        tr.appendChild(tdNome)
        tr.appendChild(tdFuncao)
        tr.appendChild(tdSalario)
        tr.appendChild(tdEditar)
        tr.appendChild(tdRemover)

        tabela.appendChild(tr)

        btnEditar.addEventListener("click",function(evento){

            campoJanela.classList.remove("ocultar")

            inputNome.value = usuario.nome 
            inputFuncao.value = usuario.funcao
            inputSalario.value = usuario.salario

            formulario.dataset.editarId = usuario.id
        })

        btnRemover.addEventListener("click",function(evento){

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            
            swalWithBootstrapButtons.fire({
                title: `Deseja apagar usuário [${usuario.nome}]?`,
                text: "Esta ação não poderá ser desfeita!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sim, remover!",
                cancelButtonText: "Cancelar",
                reverseButtons: true
            })
            .then((resultado)=>{
                if(resultado.isConfirmed){

                    listaUsuarios = listaUsuarios.filter(u => u.id !== usuario.id)

                    setItem()
                    
                    renderizarTabela()

                    sucesso(`Usuário ${usuario.nome} removido!`,"Sucesso ao remover usuário..")
                }
                else if(resultado.dismiss === Swal.DismissReason.cancel){
                    sucesso("Cancelado!","Usuário não será removido.")
                }
            })
        })
    })
}

btnFecharForm.addEventListener("click",function(evento){
    campoJanela.classList.add("ocultar")
})


function sucesso(titulo,msg){
    Swal.fire({
        position: "center",
        icon: "success",
        title: titulo,
        text: msg,
        showConfirmButton: false,
        timer: 1500
    })
}
function falha(msg){
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: msg,
    });
}


