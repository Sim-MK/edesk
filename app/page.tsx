"use client";
import { Box, Tabs, Tab, Paper, Button, Stack, IconButton, Modal, Typography, Divider, TextField, } from "@mui/material";
import { RichTreeView, useTreeViewApiRef } from "@mui/x-tree-view";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { TABLE_DATA, TREE_DATA } from "./sample-data";
import { useState, Fragment } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface FilterType {
  category: "country" | "state" | "city";
  value: string;
}

// Default style for the modal
const MODAL_STYLE = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: 800,
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

// Container for all tab content
function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      hidden={value !== index}
      {...other}
      style={{ flexGrow: 1 }}
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "row",
          gap: 3,
          justifyContent: "flex-start",
        }}
      >
        {children}
      </Box>
    </div>
  );
}

function camelToTitle(value: string) {
  return value
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
}

function ActionRow(param: Readonly<GridRenderCellParams>) {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const rowData = param.api.getRow(param.id) as Record<string, string>;

  return (
    <Stack direction="row" spacing={1}>
      <IconButton onClick={openModal}>
        <Visibility />
      </IconButton>
      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...MODAL_STYLE, overflow: "scroll" }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Details
          </Typography>
          <Divider />
          {Object.entries(rowData).map(([key, val]) => (
            <Fragment key={key}>
              <Typography
                sx={{
                  overflowWrap: "break-word",
                  fontWeight: "bold",
                  paddingTop: 2,
                }}
              >
                {" "}
                {camelToTitle(key)}
              </Typography>
              <Typography sx={{ overflowWrap: "break-word" }}>
                {" "}
                {val}
              </Typography>
            </Fragment>
          ))}
        </Box>
      </Modal>
      <IconButton>
        <Edit />
      </IconButton>
      <IconButton>
        <Delete />
      </IconButton>
    </Stack>
  );
}

function CustomerDetails({ filter }: Readonly<{ filter: FilterType | null; }>) {
  const columns = [
    {
      field: "id",
      headerName: "#",
    },
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "address",
      headerName: "Address",
    },
    {
      field: "city",
      headerName: "City",
    },
    {
      field: "pinCode",
      headerName: "Pin Code",
    },
    {
      field: "country",
      headerName: "Country",
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      minWidth: 175,
      renderCell: ActionRow,
    },
  ];

  const rows = TABLE_DATA.map((item) => {
    const { id, name, address, city, state, pinCode, country } = item;
    return {
      id,
      name,
      address,
      city,
      state,
      pinCode,
      country,
    };
  });

  const filteredRows = filter
    ? rows.filter(
      (row) => row[filter.category as keyof typeof row] === filter.value
    )
    : rows;

  return (
    <Box sx={{ backgroundColor: "whitesmoke", p: 3 }}>
      <Paper
        sx={{
          height: 500,
          display: "flex",
          flexDirection: "column",
          padding: 3,
          rowGap: 1,
        }}
      >
        <Typography variant="h6">Customer Details</Typography>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          disableColumnMenu
          initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
          pageSizeOptions={[5, 10, 15, 20]}
          sx={{ border: 0, overflowWrap: "break-word" }}
        />
      </Paper>
    </Box>
  );
}

// Houses the content of the login tab
function LoginTab() {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setUserId("");
    setPassword("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openModal();
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        border: 1,
        minHeight: 200,
        minWidth: 250,
      }}
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField
        required
        id="userId"
        label="User ID"
        value={userId}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setUserId(event.target.value);
        }}
        variant="standard"
        sx={{ width: "50%" }}
      />
      <TextField
        required
        id="password"
        type="password"
        label="Password"
        value={password}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setPassword(event.target.value);
        }}
        variant="standard"
        sx={{ width: "50%" }}
      />
      <Button
        type="submit"
        sx={{ alignSelf: "end", marginRight: 2, marginTop: 2 }}
        variant="outlined"
      >
        Submit
      </Button>
      <Modal
        open={open}
        onClose={closeModal}
      >
        <Box sx={{ ...MODAL_STYLE, overflow: "scroll" }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Login Details
          </Typography>
          <Divider />
          <Typography
            sx={{
              overflowWrap: "break-word",
              fontWeight: "bold",
              paddingTop: 2,
            }}
          >
            User ID
          </Typography>
          <Typography sx={{ overflowWrap: "break-word" }}> {userId}</Typography>
          <Typography
            sx={{
              overflowWrap: "break-word",
              fontWeight: "bold",
              paddingTop: 2,
            }}
          >
            Password
          </Typography>
          <Typography sx={{ overflowWrap: "break-word" }}>
            {password}
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}

// Component for displaying tab menu
function TabMenu({ tabIndex, handleChange }: any) {
  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={tabIndex}
      onChange={handleChange}
      textColor="primary"
      sx={{
        minWidth: 100,
        minHeight: 100,
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      <Tab label="Home" />
      <Tab label="Profile" />
      <Tab label="Messages" />
      <Tab label="Settings" />
    </Tabs>
  );
}

// Holds all content for the home tab
function HomeTab() {
  const treeViewApiRef = useTreeViewApiRef();

  // Used to filter the data shown in the table based on the tree node selected
  const [tableFilter, setTableFilter] = useState<FilterType | null>(null);
  const filterTableData = (event: React.MouseEvent, itemId: string) => {
    const { category, value } = treeViewApiRef.current!.getItem(itemId);
    setTableFilter({ category, value });
  };

  return (
    <Fragment>
      <RichTreeView
        items={TREE_DATA}
        apiRef={treeViewApiRef}
        getItemLabel={(node) => node.value}
        onItemClick={filterTableData}
        sx={{ overflowY: "scroll", scrollbarWidth: "none" }}
      />
      <CustomerDetails filter={tableFilter} />
    </Fragment>
  );
}

// Holds all tab related content
function Tabset() {
  // Used to determine the current active tab
  const [tabIndex, setTabIndex] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ display: "flex", maxHeight: "100%", width: "100%" }}>
      <TabMenu {...{ tabIndex, handleChange }} />
      <TabPanel value={tabIndex} index={0}>
        <HomeTab />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <LoginTab />
      </TabPanel>
    </Box>
  );
}

export default function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 12 }}>
      <Tabset />
    </Box>
  );
}
