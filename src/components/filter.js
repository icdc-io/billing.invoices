// import PropTypes from "prop-types";
// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Checkbox, Dropdown } from "semantic-ui-react";

// const Filter = ({ onChange }) => {
// 	const { t } = useTranslation();
// 	const [selection, setSelection] = useState([0]);

// 	const filterCategories = [
// 		{ id: 0, title: "all" },
// 		{ id: 1, title: "paidInvoices", values: ["paid"] },
// 		{ id: 2, title: "unPaidInvoices", values: ["unpaid"] },
// 		{ id: 3, title: "draftInvoices", values: ["draft"] },
// 		{ id: 4, title: "postDueInvoices", values: ["post_due"] },
// 	];

// 	useEffect(() => {
// 		if (!selection?.length) {
// 			setSelection([0]);
// 		}

// 		const filter = [];

// 		if (selection.length) {
// 			selection.forEach((x) => {
// 				const category = filterCategories.find((y) => y.id === x);

// 				if (category?.values?.length) {
// 					filter.push(...category.values);
// 				}
// 			});
// 		}

// 		onChange(filter);
// 	}, [selection]);

// 	const toggleSelection = (e, { checked, id }) => {
// 		if (!id) {
// 			setSelection([0]);
// 			return;
// 		}

// 		if (!checked) {
// 			const newSelection = selection.filter((el) => el !== 0);
// 			setSelection([...newSelection, id]);
// 		} else {
// 			setSelection(selection.filter((el) => el !== id));
// 		}
// 	};

// 	return (
// 		<Dropdown
// 			text="Filter"
// 			icon="filter"
// 			floating
// 			labeled
// 			button
// 			className="icon"
// 		>
// 			<Dropdown.Menu>
// 				{filterCategories.map(({ id, title }) => (
// 					<Dropdown.Item key={id} defaultValue={filterCategories[0]}>
// 						<Checkbox
// 							id={id}
// 							label={t(title)}
// 							checked={selection.includes(id)}
// 							onMouseDown={toggleSelection}
// 							defaultValue={filterCategories[0]}
// 						/>
// 					</Dropdown.Item>
// 				))}
// 			</Dropdown.Menu>
// 		</Dropdown>
// 	);
// };

// Filter.propTypes = {
// 	onChange: PropTypes.func,
// };

// export default Filter;
