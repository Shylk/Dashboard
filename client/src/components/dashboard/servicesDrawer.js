import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Collapse } from '@mui/material';
import { Button } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

const ExpandableListItem = ({ service, callback }) => {
    const [listOpen, setListOpen] = useState(false);
    const openList = () => setListOpen(!listOpen);

    return (
        <React.Fragment>
            <ListItem button onClick={openList}>
                <ListItemText primary={service.name} />
                {listOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={listOpen} timeout="auto" unmountOnExit>
                {service.widgets.map((widget, index) => {
                    return (
                        <ListItem
                            button
                            key={widget.name}
                            sx={{ pl: 4 }}
                            onClick={() => callback(widget)}
                        >
                            <ListItemText primary={widget.name} />
                        </ListItem>
                    );
                })}
            </Collapse>
        </React.Fragment>
    );
};

const ServicesDrawer = (props) => {
    // React.memo() - useMemo()
    // useEffect for api calls
    return (
        <div>
            <Drawer
                anchor="left"
                open={props.isOpen}
                onClose={props.closeCallback}
            >
                <Box sx={{ width: 250 }}>
                    <List>
                        {props.services.map((service) => (
                            <ExpandableListItem
                                service={service}
                                callback={(SelectedWidget) =>
                                    props.callback(SelectedWidget)
                                }
                                key={service.name}
                            />
                        ))}
                    </List>
                </Box>
                <Button
                    onClick={props.deleteCallback}
                    sx={{ mt: '50vh' }}
                    endIcon={<CleaningServicesIcon />}
                    color="error"
                >
                    Clear workspace
                </Button>
            </Drawer>
        </div>
    );
};

export default ServicesDrawer;
