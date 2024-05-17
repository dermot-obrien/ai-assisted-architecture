package org.dobrien.ea.infrastructure;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
public class ServiceCategory {

    private String id;
    private String name;
    private String description;
    private String link;
    private String iconSet;
    private List<Service> services = new ArrayList<Service>();
    private List<Icon> icons = new ArrayList<Icon>();
}
