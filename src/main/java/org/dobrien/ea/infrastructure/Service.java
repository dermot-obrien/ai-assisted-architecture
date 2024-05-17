package org.dobrien.ea.infrastructure;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class Service {

    private String id;
    private String name;
    private String category;
    private String description;
    private String link;
    private String iconPath;
    private boolean inPreview = false;
    private boolean iconPresent = false;
}
