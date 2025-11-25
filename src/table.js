const isValidArray = (arrayElement) => {
  return Array.isArray(arrayElement) && arrayElement.length > 0;
};

export const createTable = (columsnArray, dataArray, tableID) => {
  if (!isValidArray(columsnArray) || !isValidArray(dataArray) || !tableID) {
    throw new Error(
      'Para correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também o id do elemento tabela selecionado'
    );
  }

  const tableElement = document.getElementById(tableID);
  if (!tableElement || tableElement.nodeName !== 'TABLE') {
    throw new Error('Id informado não correponde a nehum elemento table');
  }

  createTableHeader(tableElement, columsnArray);
  createTableBody(tableElement, dataArray, columsnArray);
};

function createTableHeader(tableReference, columnsArray) {
  function createTheadElement(tableReference) {
    const thead = document.createElement('thead');
    tableReference.appendChild(thead);
    return thead;
  }

  const theadReference = tableReference.querySelector('thead') ?? createTheadElement(tableReference);
  const headerRow = document.createElement('tr');
  ['bg-blue-900', 'text-slate-200', 'sticky', 'top-0'].forEach((cssClass) => headerRow.classList.add(cssClass));
  columnsArray.forEach((element) => {
    const th = document.createElement('th');
    th.innerText = element.columnLabel;
    th.setAttribute('class', 'text-center');
    headerRow.appendChild(th);
  });

  theadReference.appendChild(headerRow);
}
function createTableBody(tableReference, tableItems, columnsArray) {
  function createTbodyElement(tableReference) {
    const tbody = document.createElement('tbody');
    tableReference.appendChild(tbody);
    return tbody;
  }

  const tbodyReference = tableReference.querySelector('tbody') ?? createTbodyElement(tableReference);
  for (const [itemIndex, tableItem] of tableItems.entries()) {
    const tableRow = document.createElement('tr');
    if (itemIndex % 2 !== 0) {
      tableRow.classList.add('bg-blue-200');
    }

    for (const tableColumn of columnsArray) {
      const formatFn = tableColumn.format ?? ((info) => info);
      tableRow.innerHTML += /*html*/ `<td class="text-center">${formatFn(tableItem[tableColumn.acessor])}</td>`;
    }

    tbodyReference.appendChild(tableRow);
  }
}
