const crossroads = require('crossroads')
const hasher = require('hasher')
const $ = require('jquery')(window)
// const Handlebars = require('handlebars')

// function spawnNotification(options) {
//   var n = new Notification(options.title, options.opt)

//   if (options.link !== '') {
//     n.addEventListener("click", function() {
//       n.cose();
//       window.focus()
//       window.location.href = options.link
//     })
//   }
// }

let home = `
      <div class="container">
      <button id="btnNew" class="btn btn-dark mt-2" style="margin: 15px">Novo</button>
      <div class="row shadow-lg p-3 mb-5">
        <div class="col">
          <table id="tableProducts" class="table table-sm table-striped table-bordered" style="width:100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>DESCRIÇÃO</th>
                <th>PREÇO</th>
                <th>ESTOQUE</th>
                <th class="text-center">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
      </div>

      <div id="modalCRUD" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel"></h5>
            </div>
            <form id="formProducts">
              <div class="modal-body">
                <input id="id" hidden>

                <label for="" class="col-form-label">Descrição</label>
                <input type="text" class="form-control" id="description">

                <label for="" class="col-form-label">Preço</label>
                <input id="price" type="number" step="0.01" class="form-control">

                <label for="" class="col-form-label">Estoque</label>
                <input id="stock" type="number" class="form-control">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                <button type="submit" id="btnSave" class="btn btn-success">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `

crossroads.addRoute('/', () => {
  render(home)

  // Notification.requestPermission()

  let endpoint = 'http://localhost:3333/products'
  let option = null
  let id, description, price, stock, line

  // SHOW
  let tableProducts = jQuery('#tableProducts').DataTable({
    "ajax": {
      "url": endpoint,
      "dataSrc": ""
    },
    "columns": [
      {"data": "id"},
      {"data": "description"},
      {"data": "price"},
      {"data": "stock"},
      {"defaultContent": `
        <div class="text-center">
          <div class="btn-group">
            <button class="btn btn-info btn-sm btnEdit">Editar</button>
            <button class="btn btn-danger btn-sm btnDelete">Excluir</button>
          </div>
        </div>
      `},
    ],
    "columnDefs": [{
      "targets":[2],
        render(v) {
          return Number(v).toFixed(2)
        }
    }],
    "language": {
      "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Portuguese-Brasil.json",
    }
  })

  // NEW
  jQuery('#btnNew').on('click', function() {
    option = 'create'
    id = null

    jQuery("#formProducts").trigger("reset")
    // jQuery(".modal-header").css("background-color", "#23272b")
    // jQuery(".modal-header").css("color", "white")
    jQuery(".modal-title").text("Novo Produto")
    jQuery("#modalCRUD").modal('show')
  })

  // UPDATE
  jQuery(document).on('click', '.btnEdit', function() {
    option = 'edit'
    line = jQuery(this).closest('tr')

    id = parseInt(line.find('td:eq(0)').text())
    description = line.find('td:eq(1)').text()
    price = line.find('td:eq(2)').text()
    stock = line.find('td:eq(3)').text()

    jQuery("#id").val(id)
    jQuery("#description").val(description)
    jQuery("#price").val(price)
    jQuery("#stock").val(stock)

    // jQuery(".modal-header").css("background-color", "#7303c0")
    // jQuery(".modal-header").css("color", "white")
    jQuery(".modal-title").text("Editar produto")
    jQuery("#modalCRUD").modal("show")
  })

  // DELETE
  jQuery(document).on('click', '.btnDelete', function() {
    line = jQuery(this)
    id = parseInt(jQuery(this).closest('tr').find('td:eq(0)').text())
    description = jQuery(this).closest('tr').find('td:eq(1)').text()
    Swal.fire({
      title: 'Deseja realmente excluir o registro?',
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não'
    }).then(result => {
      if (result.isConfirmed) {
        jQuery.ajax({
          url: `${endpoint}/${id}`,
          type: "DELETE",
          data: {id:id},
          success: function() {
            tableProducts.row(line.parents('tr')).remove().draw()
            // spawnNotification({
            //   opt: {
            //     body: `Produto ${description} excluido!`,
            //     icon: ""
            //   },
            //   title: "Operação de exclusão",
            //   link: "#"
            // })
          }
        }).then(res => {
          Swal.fire(`${res.message}`, '', 'success')
        })
      }
    })
  })

  // SALVAR
  jQuery("#formProducts").submit(function(e) {
    e.preventDefault()

    id = jQuery.trim(jQuery("#id").val())
    description = jQuery.trim(jQuery("#description").val())
    price = jQuery.trim(jQuery("#price").val())
    stock = jQuery.trim(jQuery("#stock").val())

    if (option == "create") {
      jQuery.ajax({
        url: endpoint,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ description, price, stock }),
        success: function(data) {
          tableProducts.ajax.reload(null, false)
        }
      }).then(res => {
        Swal.fire(`${res.message}`, '', 'success')
      }).catch(err => {
        let error = err.responseJSON
        Swal.fire(`${error.message}`, '', 'error')
      })
    }

    if (option == "edit") {
      jQuery.ajax({
        url: `${endpoint}/${id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ description, price, stock }),
        success: function(data) {
          tableProducts.ajax.reload(null, false)
        }
      }).then(res => {
        Swal.fire(`${res.message}`, '', 'success')
      }).catch(err => {
        let error = err.responseJSON
        Swal.fire(`${error.message}`, '', 'error')
      })
    }

    jQuery("#modalCRUD").modal('hide')
  })

  setInterval(function() {
    tableProducts.ajax.reload(null, false)
  }, 3000)
})

function render(component) {
  let app = document.getElementById("app");
  app.innerHTML = ''
  app.innerHTML = component
}

function parseHash(newHash, oldHash) {
  crossroads.parse(newHash);
}

hasher.initialized.add(parseHash);
hasher.changed.add(parseHash);
hasher.init();
